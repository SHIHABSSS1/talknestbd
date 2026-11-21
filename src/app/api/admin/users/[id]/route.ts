import { randomUUID } from "node:crypto";

import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";

import { SUPER_ADMIN_ROLE_ID } from "@/lib/admin-defaults";
import {
  jsonError,
  rejectCrossSite,
  requireSuperAdmin,
  userSchema,
} from "@/lib/admin-api";
import { listAdminUsers } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { accounts, roles, userRoles, users } from "@/lib/db/schema";

type Context = { params: Promise<{ id: string }> };

async function findUser(id: string) {
  const [row] = await db.select().from(users).where(eq(users.id, id)).limit(1);
  return row;
}

export async function PATCH(request: Request, context: Context) {
  const guard = await requireSuperAdmin(request);
  if (guard.error || !guard.session) return guard.error ?? jsonError("Sign in required.", 401);
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  const { id } = await context.params;
  const existing = await findUser(id);
  if (!existing || existing.role !== "admin") return jsonError("Admin user not found.", 404);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = userSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid user.", 400);
  }
  const body = parsed.data;
  const email = body.email.toLowerCase();

  const [role] = await db.select({ id: roles.id }).from(roles).where(eq(roles.id, body.roleId)).limit(1);
  if (!role) return jsonError("Choose a valid role.", 400);
  const [taken] = await db
    .select({ id: users.id })
    .from(users)
    .where(and(eq(users.email, email), ne(users.id, id)))
    .limit(1);
  if (taken) return jsonError("An account with that email already exists.", 409);

  // Never let the last super admin lose that role or become unable to sign in.
  if (existing.id === guard.session.user.id) {
    const current = await db
      .select({ permissions: roles.permissions })
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(userRoles.userId, id));
    const wasSuper = current.some((row) => row.permissions.includes("*"));
    if (wasSuper && body.roleId !== SUPER_ADMIN_ROLE_ID) {
      return jsonError("You cannot remove your own Super Admin role.", 400);
    }
    if (wasSuper && body.status !== "active") {
      return jsonError("You cannot deactivate your own account.", 400);
    }
  }

  const hash = body.password ? await hashPassword(body.password) : null;
  const now = new Date();

  try {
    await db.transaction(async (tx) => {
      await tx
        .update(users)
        .set({ name: body.name, email, emailVerified: body.status === "active", updatedAt: now })
        .where(eq(users.id, id));
      if (hash) {
        await tx
          .delete(accounts)
          .where(and(eq(accounts.userId, id), eq(accounts.providerId, "credential")));
        await tx.insert(accounts).values({
          id: randomUUID(),
          userId: id,
          providerId: "credential",
          accountId: id,
          password: hash,
          createdAt: now,
          updatedAt: now,
        });
      }
      await tx.delete(userRoles).where(eq(userRoles.userId, id));
      await tx.insert(userRoles).values({ userId: id, roleId: body.roleId });
    });
  } catch (error) {
    console.error("[admin/users] update failed:", error);
    return jsonError("Could not save that admin. Try again.", 500);
  }

  const [updated] = (await listAdminUsers()).filter((user) => user.id === id);
  return NextResponse.json({ user: updated });
}

export async function DELETE(request: Request, context: Context) {
  const guard = await requireSuperAdmin(request);
  if (guard.error || !guard.session) return guard.error ?? jsonError("Sign in required.", 401);
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  const { id } = await context.params;
  if (id === guard.session.user.id) {
    return jsonError("You cannot delete your own account.", 400);
  }
  const existing = await findUser(id);
  if (!existing || existing.role !== "admin") return jsonError("Admin user not found.", 404);

  await db.delete(users).where(eq(users.id, id));
  return NextResponse.json({ ok: true });
}
