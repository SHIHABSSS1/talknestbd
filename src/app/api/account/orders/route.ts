import { desc, eq, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  badRequest,
  getApiSession,
  mapOrder,
  newId,
  orderSchema,
  resolveUnitPrice,
  unauthorized,
} from "@/lib/account-api";
import { db } from "@/lib/db";
import { audioUnlocks, orderItems, orders } from "@/lib/db/schema";
import { generateOrderId } from "@/lib/orders";

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const rows = await db
    .select()
    .from(orders)
    .where(eq(orders.userId, session.user.id))
    .orderBy(desc(orders.createdAt));

  const ids = rows.map((row) => row.id);
  const items = ids.length
    ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids))
    : [];

  return NextResponse.json(
    rows.map((row) =>
      mapOrder(
        row,
        items
          .filter((item) => item.orderId === row.id)
          .map((item) => ({
            slug: item.bookSlug ?? "",
            kind: item.kind as "book" | "sunnah" | "audio",
            title: item.titleSnapshot,
            meta: item.meta ?? undefined,
            price: Number(item.price),
            quantity: item.quantity,
          })),
      ),
    ),
  );
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
  const parsed = orderSchema.safeParse(payload);
  if (!parsed.success) {
    return badRequest(parsed.error.issues[0]?.message ?? "Invalid order.");
  }

  const body = parsed.data;
  // Never trust prices supplied by the browser.
  const pricedItems = body.items.map((item) => {
    const unitPrice = resolveUnitPrice(item.slug, item.kind);
    if (unitPrice === null) {
      return { item, unitPrice: null };
    }
    return { item, unitPrice };
  });
  const unknown = pricedItems.find((entry) => entry.unitPrice === null);
  if (unknown) {
    return badRequest(`Unknown item: ${unknown.item.slug}`);
  }

  const subtotal = pricedItems.reduce(
    (sum, entry) => sum + (entry.unitPrice ?? 0) * entry.item.quantity,
    0,
  );
  const total = subtotal + body.deliveryCharge;
  if (Math.abs(total - body.total) > 1) {
    return badRequest("The order total no longer matches the catalogue prices. Refresh your cart.");
  }

  let orderId = body.id ?? generateOrderId();
  for (let attempt = 0; attempt < 3; attempt++) {
    const [taken] = await db.select({ id: orders.id }).from(orders).where(eq(orders.id, orderId)).limit(1);
    if (!taken) break;
    orderId = generateOrderId();
  }

  const saved = await db.transaction(async (tx) => {
    const [order] = await tx
      .insert(orders)
      .values({
        id: orderId,
        userId: session.user.id,
        status: (body.status ?? "Confirmed").toLowerCase(),
        subtotal: subtotal.toFixed(2),
        deliveryCharge: body.deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: body.paymentMethod,
        paymentNumber: body.paymentNumber || null,
        deliveryMethod: body.deliveryMethod,
        addressSnapshot: body.address,
        note: body.note || null,
      })
      .returning();

    await tx.insert(orderItems).values(
      pricedItems.map(({ item, unitPrice }) => ({
        id: newId("item"),
        orderId,
        bookSlug: item.slug,
        kind: item.kind,
        titleSnapshot: item.title,
        meta: item.meta || null,
        price: (unitPrice ?? 0).toFixed(2),
        quantity: item.quantity,
      })),
    );

    const audioSlugs = pricedItems
      .filter(({ item }) => item.kind === "audio")
      .map(({ item }) => item.slug);
    if (audioSlugs.length) {
      await tx
        .insert(audioUnlocks)
        .values(audioSlugs.map((slug) => ({ userId: session.user.id, slug, orderId })))
        .onConflictDoNothing();
    }

    return order;
  });

  const savedItems = await db.select().from(orderItems).where(eq(orderItems.orderId, orderId));
  return NextResponse.json(
    mapOrder(
      saved,
      savedItems.map((item) => ({
        slug: item.bookSlug ?? "",
        kind: item.kind as "book" | "sunnah" | "audio",
        title: item.titleSnapshot,
        meta: item.meta ?? undefined,
        price: Number(item.price),
        quantity: item.quantity,
      })),
    ),
    { status: 201 },
  );
}
