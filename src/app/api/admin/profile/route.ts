import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  getAdminContext,
  jsonError,
  profileSchema,
  rejectCrossSite,
} from "@/lib/admin-api";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function PATCH(request: Request) {
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
  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonError(parsed.error.issues[0]?.message ?? "Invalid profile.", 400);
  }

  const image = parsed.data.image ? parsed.data.image : null;
  const [updated] = await db
    .update(users)
    .set({
      name: parsed.data.name,
      email: parsed.data.email,
      image,
      // An admin changing their own address keeps the account usable.
      emailVerified: true,
      updatedAt: new Date(),
    })
    .where(eq(users.id, context.session.user.id))
    .returning({
      name: users.name,
      email: users.email,
      image: users.image,
    });

  return NextResponse.json({
    name: updated.name,
    email: updated.email,
    image: updated.image ?? null,
  });
}
