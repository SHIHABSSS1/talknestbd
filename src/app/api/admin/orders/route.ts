import { NextResponse } from "next/server";
import { and, desc, eq, ilike, inArray, or, sql } from "drizzle-orm";

import { getAdminContext, jsonError } from "@/lib/admin-api";
import { mapOrder } from "@/lib/account-api";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim().slice(0, 120) || "";
  const status = url.searchParams.get("status") || "";
  const payment = url.searchParams.get("payment") || "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") ?? 10) || 10));

  const filters = [];
  if (["confirmed", "processing", "out_for_delivery"].includes(status)) {
    filters.push(eq(orders.status, status));
  }
  if (["pending", "paid", "refunded"].includes(payment)) {
    filters.push(eq(orders.paymentStatus, payment));
  }
  if (q) {
    const term = `%${q}%`;
    const search = or(
      ilike(orders.id, term),
      sql`${orders.addressSnapshot}->>'name' ilike ${term}`,
      sql`${orders.addressSnapshot}->>'phone' ilike ${term}`,
    );
    if (search) filters.push(search);
  }
  const where = filters.length ? and(...filters) : undefined;

  try {
    const [rows, countRows] = await Promise.all([
      db
        .select()
        .from(orders)
        .where(where)
        .orderBy(desc(orders.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ id: orders.id }).from(orders).where(where),
    ]);
    const ids = rows.map((row) => row.id);
    const items = ids.length
      ? await db.select().from(orderItems).where(inArray(orderItems.orderId, ids))
      : [];

    return NextResponse.json({
      orders: rows.map((row) =>
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
      total: countRows.length,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[admin orders] list failed:", error);
    return jsonError("Could not load orders.", 500);
  }
}
