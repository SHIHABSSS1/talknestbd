import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  addressSchema,
  badRequest,
  getApiSession,
  mapAddress,
  notFound,
  toAddressDb,
  unauthorized,
} from "@/lib/account-api";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";

type Context = { params: Promise<{ id: string }> };

async function findOwned(id: string, userId: string) {
  const [row] = await db
    .select()
    .from(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, userId)))
    .limit(1);
  return row;
}

export async function PATCH(request: Request, context: Context) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const existing = await findOwned(id, session.user.id);
  if (!existing) return notFound("Address not found.");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = addressSchema.safeParse(payload);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid address.");
  }

  const updated = await db.transaction(async (tx) => {
    if (parsed.data.isDefault) {
      await tx
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id));
    }
    const [row] = await tx
      .update(addresses)
      .set(toAddressDb(parsed.data))
      .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)))
      .returning();
    return row;
  });

  return NextResponse.json(mapAddress(updated));
}

export async function DELETE(request: Request, context: Context) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const [deleted] = await db
    .delete(addresses)
    .where(and(eq(addresses.id, id), eq(addresses.userId, session.user.id)))
    .returning({ id: addresses.id });

  if (!deleted) return notFound("Address not found.");
  return NextResponse.json({ ok: true });
}
