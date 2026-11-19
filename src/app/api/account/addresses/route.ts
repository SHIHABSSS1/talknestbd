import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  addressSchema,
  badRequest,
  getApiSession,
  mapAddress,
  newId,
  toAddressDb,
  unauthorized,
} from "@/lib/account-api";
import { db } from "@/lib/db";
import { addresses } from "@/lib/db/schema";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const rows = await db
    .select()
    .from(addresses)
    .where(eq(addresses.userId, session.user.id))
    .orderBy(desc(addresses.isDefault), desc(addresses.createdAt));

  return NextResponse.json(rows.map(mapAddress));
}

export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

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

  const values = toAddressDb(parsed.data);
  const created = await db.transaction(async (tx) => {
    if (values.isDefault) {
      await tx
        .update(addresses)
        .set({ isDefault: false })
        .where(eq(addresses.userId, session.user.id));
    }
    const [row] = await tx
      .insert(addresses)
      .values({ id: newId("addr"), userId: session.user.id, ...values })
      .returning();
    return row;
  });

  return NextResponse.json(mapAddress(created), { status: 201 });
}
