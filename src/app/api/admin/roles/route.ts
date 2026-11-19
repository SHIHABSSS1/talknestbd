import { NextResponse } from "next/server";

import {
  getAdminContext,
  jsonError,
  rejectCrossSite,
  requireSuperAdmin,
  roleSchema,
} from "@/lib/admin-api";
import { listRoles } from "@/lib/admin-roles";
import { db } from "@/lib/db";
import { roles } from "@/lib/db/schema";

export async function GET(request: Request) {
  const context = await getAdminContext(request);
  if (context.error) return context.error;
  return NextResponse.json({ roles: await listRoles() });
}

export async function POST(request: Request) {
  const guard = await requireSuperAdmin(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

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

  const id = `role_${crypto.randomUUID()}`;
  try {
    const [created] = await db
      .insert(roles)
      .values({
        id,
        name: parsed.data.name,
        description: parsed.data.description,
        permissions: parsed.data.permissions,
        system: false,
      })
      .returning();
    return NextResponse.json({ role: (await listRoles()).find((role) => role.id === created.id) }, { status: 201 });
  } catch {
    return jsonError("Could not create that role — the name may already be in use.", 409);
  }
}
