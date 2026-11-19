import { randomUUID } from "node:crypto";

import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { hashPassword } from "better-auth/crypto";

import {
  getAdminContext,
  jsonError,
  rejectCrossSite,
  requireSuperAdmin,
  userSchema,
} from "@/lib/admin-api";
import { listAdminUsers } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { accounts, roles, userRoles, users } from "@/lib/db/schema";

export async function GET(request: Request) {
  const context = await requireSuperAdmin(request);
  if (context.error) return context.error;
  return NextResponse.json({ users: await listAdminUsers() });
}

export async function POST(request: Request) {
  const context = await requireSuperAdmin(request);
  if (context.error) return context.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

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

  const [taken] = await db.select({ id: users.id }).from(users).where(eq(users.email, email)).limit(1);
  if (taken) return jsonError("An account with that email already exists.", 409);

  const id = randomUUID();
  const now = new Date();
  const hash = body.password ? await hashPassword(body.password) : null;

  try {
    await db.transaction(async (tx) => {
      await tx.insert(users).values({
        id,
        name: body.name,
        email,
        emailVerified: body.status === "active",
        role: "admin",
        createdAt: now,
        updatedAt: now,
      });
      if (hash) {
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
      await tx.insert(userRoles).values({ userId: id, roleId: body.roleId });
    });
  } catch (error) {
    console.error("[admin/users] create failed:", error);
    return jsonError("Could not create that admin. Try again.", 500);
  }

  const [created] = (await listAdminUsers()).filter((user) => user.id === id);
  return NextResponse.json({ user: created }, { status: 201 });
}
