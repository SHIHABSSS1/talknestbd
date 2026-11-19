import { NextResponse } from "next/server";

import {
  getAdminContext,
  jsonError,
  passwordSchema,
  rejectCrossSite,
} from "@/lib/admin-api";
import { auth } from "@/lib/auth";

/** Uses Better Auth's own password change so hashing and session rules stay in sync. */
export async function POST(request: Request) {
  const context = await getAdminContext(request);
  if (context.error || !context.session) return context.error ?? jsonError("Sign in required.", 401);
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = passwordSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid password.", 400);
  }

  try {
    await auth.api.changePassword({
      headers: request.headers,
      body: {
        currentPassword: parsed.data.currentPassword,
        newPassword: parsed.data.newPassword,
        revokeOtherSessions: false,
      },
    });
    return NextResponse.json({ ok: true });
  } catch {
    return jsonError("Current password is incorrect, or the new password was rejected.", 400);
  }
}
