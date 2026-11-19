import { desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";

import { auth } from "@/lib/auth";
import { mapOrder } from "@/lib/account-api";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in required." }, { status: 401 });
  }
  if (session.user.role !== "admin") {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }

  const rows = await db.select().from(orders).orderBy(desc(orders.createdAt));
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
