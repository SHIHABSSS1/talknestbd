import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import { badRequest, getApiSession, profileSchema, unauthorized } from "@/lib/account-api";
import { db } from "@/lib/db";
import { users } from "@/lib/db/schema";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const { name, email, phone, city, image } = session.user;
  return NextResponse.json({ name, email, phone: phone ?? "", city: city ?? "", image: image ?? null });
}

export async function PATCH(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = profileSchema.safeParse(payload);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid profile.");
  }

  const [updated] = await db
    .update(users)
    .set({
      name: parsed.data.name,
      phone: parsed.data.phone ?? null,
      city: parsed.data.city ?? null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, session.user.id))
    .returning({
      name: users.name,
      email: users.email,
      phone: users.phone,
      city: users.city,
      image: users.image,
    });

  return NextResponse.json({
    name: updated.name,
    email: updated.email,
    phone: updated.phone ?? "",
    city: updated.city ?? "",
    image: updated.image ?? null,
  });
}
