import "server-only";

import { NextResponse } from "next/server";
import { z } from "zod";

import { defaultAdminRoles, type AdminRole } from "@/lib/admin-defaults";
import { getRoleForUser } from "@/lib/admin-roles";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { roles } from "@/lib/db/schema";
import { allPageHrefs, isSuperOnlyPage } from "@/lib/admin-access";

type Session = Awaited<ReturnType<typeof auth.api.getSession>>;

export type AdminRequestContext = {
  error: NextResponse | null;
  session: Session;
  role: AdminRole | null;
  isSuperAdmin: boolean;
};

export function jsonError(message: string, status: number): NextResponse {
  return NextResponse.json({ error: message }, { status });
}

/** Cookie-authenticated writes must not be reachable from another origin. */
export function rejectCrossSite(request: Request): NextResponse | null {
  const origin = request.headers.get("origin");
  if (!origin) return null;
  const appOrigin = new URL(
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ).origin;
  return origin === appOrigin ? null : jsonError("Invalid origin.", 403);
}

export async function getAdminContext(request: Request): Promise<AdminRequestContext> {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return { error: jsonError("Sign in required.", 401), session: null, role: null, isSuperAdmin: false };
  }
  if (session.user.role !== "admin") {
    return { error: jsonError("Admin access required.", 403), session, role: null, isSuperAdmin: false };
  }
  const role = await getRoleForUser(session.user.id);
  return { error: null, session, role, isSuperAdmin: role?.permissions.includes("*") ?? false };
}

export async function requireSuperAdmin(request: Request): Promise<AdminRequestContext> {
  const context = await getAdminContext(request);
  if (context.error) return context;
  if (!context.isSuperAdmin) {
    return {
      ...context,
      error: jsonError("Super admin access required.", 403),
    };
  }
  return context;
}

/** Self-heals the built-in roles on first use after a fresh migration. */
export async function ensureDefaultRoles(): Promise<void> {
  await db
    .insert(roles)
    .values(
      defaultAdminRoles.map((role) => ({
        id: role.id,
        name: role.name,
        description: role.description,
        permissions: role.permissions,
        system: role.system,
      })),
    )
    .onConflictDoNothing({ target: roles.id });
}

const knownPages = new Set(allPageHrefs());

export const roleSchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: z.string().trim().max(200).optional().default(""),
  permissions: z
    .array(z.string())
    .min(1, "Grant access to at least one page.")
    .refine(
      (values) => values.includes("*") || values.every((value) => knownPages.has(value)),
      "Unknown admin page in permissions.",
    )
    .refine((values) => !values.includes("/admin/users"), "Users & roles is super admin only."),
});

export const userSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  roleId: z.string().trim().min(1),
  status: z.enum(["active", "invited"]),
  password: z.string().min(8).max(128).optional(),
});

export const profileSchema = z.object({
  name: z.string().trim().min(2).max(80),
  email: z.string().trim().email(),
  /** A local /media URL (or an approved remote URL) — never a data URL. */
  image: z
    .string()
    .trim()
    .max(2_000)
    .nullable()
    .optional()
    .refine(
      (value) => !value || value.startsWith("/media/") || /^https?:\/\//.test(value),
      "Use a /media URL for the profile picture.",
    ),
});

export const passwordSchema = z.object({
  currentPassword: z.string().min(1),
  newPassword: z.string().min(8).max(128),
});
