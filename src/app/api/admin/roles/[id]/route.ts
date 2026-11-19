import { and, eq, ne } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  jsonError,
  rejectCrossSite,
  requireSuperAdmin,
  roleSchema,
} from "@/lib/admin-api";
import { listRoles, mapRole } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { roles, userRoles } from "@/lib/db/schema";

type Context = { params: Promise<{ id: string }> };

export async function PATCH(request: Request, context: Context) {
  const guard = await requireSuperAdmin(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  const { id } = await context.params;
  const [existing] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
  if (!existing) return jsonError("Role not found.", 404);
  if (existing.system) return jsonError("The built-in Super Admin role cannot be edited.", 403);

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = roleSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid role.", 400);
  }

  const [conflict] = await db
    .select({ id: roles.id })
    .from(roles)
    .where(and(eq(roles.name, parsed.data.name), ne(roles.id, id)))
    .limit(1);
  if (conflict) return jsonError("A role with that name already exists.", 409);

  const [updated] = await db
    .update(roles)
    .set({
      name: parsed.data.name,
      description: parsed.data.description,
      permissions: parsed.data.permissions,
      updatedAt: new Date(),
    })
    .where(eq(roles.id, id))
    .returning();
  return NextResponse.json({ role: mapRole(updated) });
}

export async function DELETE(request: Request, context: Context) {
  const guard = await requireSuperAdmin(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  const { id } = await context.params;
  const [existing] = await db.select().from(roles).where(eq(roles.id, id)).limit(1);
  if (!existing) return jsonError("Role not found.", 404);
  if (existing.system) return jsonError("The built-in Super Admin role cannot be deleted.", 403);

  await db.transaction(async (tx) => {
    await tx.delete(userRoles).where(eq(userRoles.roleId, id));
    await tx.delete(roles).where(eq(roles.id, id));
  });
  return NextResponse.json({ ok: true, roles: await listRoles() });
}
