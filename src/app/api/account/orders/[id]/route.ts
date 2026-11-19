import { and, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

import {
  getApiSession,
  mapOrder,
  notFound,
  unauthorized,
} from "@/lib/account-api";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";

export async function GET(request: Request, context: { params: Promise<{ id: string }> }) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const { id } = await context.params;
  const [order] = await db
    .select()
    .from(orders)
    .where(and(eq(orders.id, id), eq(orders.userId, session.user.id)))
    .limit(1);
  if (!order) return notFound("Order not found.");

  const items = await db.select().from(orderItems).where(eq(orderItems.orderId, id));
  return NextResponse.json(
    mapOrder(
      order,
      items.map((item) => ({
        slug: item.bookSlug ?? "",
        kind: item.kind as "book" | "sunnah" | "audio",
        title: item.titleSnapshot,
        meta: item.meta ?? undefined,
        price: Number(item.price),
        quantity: item.quantity,
      })),
    ),
  );
}
