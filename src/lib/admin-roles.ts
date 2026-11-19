import "server-only";

import { asc, eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { roles, userRoles, users } from "@/lib/db/schema";
import type { AdminRole, AdminUser } from "@/lib/admin-defaults";

type RoleRow = typeof roles.$inferSelect;

export function mapRole(row: RoleRow): AdminRole {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    permissions: Array.isArray(row.permissions)
      ? row.permissions.filter((item): item is string => typeof item === "string")
      : [],
    system: row.system,
    createdAt: row.createdAt.toISOString(),
  };
}

/** The single assigned role for a user, or null when none was granted. */
export async function getRoleForUser(userId: string): Promise<AdminRole | null> {
  const [row] = await db
    .select({ role: roles })
    .from(userRoles)
    .innerJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(userRoles.userId, userId))
    .limit(1);
  return row ? mapRole(row.role) : null;
}

/** All accounts that can reach the admin panel, with their assigned role. */
export async function listAdminUsers(): Promise<AdminUser[]> {
  const rows = await db
    .select({
      id: users.id,
      name: users.name,
      email: users.email,
      image: users.image,
      emailVerified: users.emailVerified,
      createdAt: users.createdAt,
      roleId: userRoles.roleId,
      roleName: roles.name,
    })
    .from(users)
    .leftJoin(userRoles, eq(userRoles.userId, users.id))
    .leftJoin(roles, eq(roles.id, userRoles.roleId))
    .where(eq(users.role, "admin"))
    .orderBy(asc(users.createdAt));

  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    email: row.email,
    image: row.image ?? null,
    roleId: row.roleId ?? null,
    roleName: row.roleName ?? null,
    status: row.emailVerified ? "active" : "invited",
    joinedAt: row.createdAt.toISOString(),
  }));
}

export async function listRoles(): Promise<AdminRole[]> {
  const rows = await db.select().from(roles).orderBy(asc(roles.createdAt));
  return rows.map(mapRole);
}

/** Replaces a user's role assignment (the UI assigns exactly one role). */
export async function assignRole(userId: string, roleId: string): Promise<void> {
  await db.transaction(async (tx) => {
    await tx.delete(userRoles).where(eq(userRoles.userId, userId));
    await tx.insert(userRoles).values({ userId, roleId });
  });
}
