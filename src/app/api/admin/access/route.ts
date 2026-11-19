import { NextResponse } from "next/server";

import { ensureDefaultRoles, getAdminContext, jsonError } from "@/lib/admin-api";
import type { AdminUser } from "@/lib/admin-defaults";
import { listAdminUsers, listRoles } from "@/lib/admin-roles";

/** Single hydration request for the admin shell: identity, role and nav data. */
export async function GET(request: Request) {
  const context = await getAdminContext(request);
  if (context.error || !context.session) return context.error ?? jsonError("Sign in required.", 401);

  await ensureDefaultRoles();

  const { session, role, isSuperAdmin } = context;
  const currentUser: AdminUser = {
    id: session.user.id,
    name: session.user.name,
    email: session.user.email,
    image: session.user.image ?? null,
    roleId: role?.id ?? null,
    roleName: role?.name ?? null,
    status: session.user.emailVerified ? "active" : "invited",
    joinedAt: session.user.createdAt.toISOString(),
  };

  const [allRoles, allUsers] = await Promise.all([
    listRoles(),
    isSuperAdmin ? listAdminUsers() : Promise.resolve([]),
  ]);

  return NextResponse.json({
    currentUser,
    currentRole: role,
    roles: allRoles,
    users: allUsers,
  });
}
