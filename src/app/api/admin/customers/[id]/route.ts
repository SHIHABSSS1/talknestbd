import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { getAdminContext, jsonError } from "@/lib/admin-api";
import { mapOrder } from "@/lib/account-api";
import { db } from "@/lib/db";
import { addresses, orderItems, orders, users } from "@/lib/db/schema";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const { id } = await params;

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, id))
    .limit(1);
  if (!user) return jsonError("Customer not found.", 404);

  const [orderRows, addressRows] = await Promise.all([
    db.select().from(orders).where(eq(orders.userId, id)).orderBy(desc(orders.createdAt)),
    db.select().from(addresses).where(eq(addresses.userId, id)).orderBy(desc(addresses.isDefault)),
  ]);
  const ids = orderRows.map((row) => row.id);
  const allItems: (typeof orderItems.$inferSelect)[] = [];
  for (const orderId of ids.slice(0, 50)) {
    const rows = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, orderId));
    allItems.push(...rows);
  }

  return NextResponse.json({
    customer: {
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone ?? "",
      city: user.city ?? "",
      joined: user.createdAt.toISOString(),
      status: user.emailVerified ? "Active" : "New",
    },
    orders: orderRows.map((row) =>
      mapOrder(
        row,
        allItems
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
    addresses: addressRows.map((row) => ({
      id: row.id,
      label: row.label,
      name: row.name,
      phone: row.phone,
      city: `${row.district}, ${row.division}`,
      street: row.street,
      isDefault: row.isDefault,
    })),
  });
}
