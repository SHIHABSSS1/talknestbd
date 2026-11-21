import { NextResponse } from "next/server";
import { and, desc, eq, ilike, or, sql } from "drizzle-orm";

import { getAdminContext, jsonError } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { orders, users } from "@/lib/db/schema";

export interface AdminCustomerView {
  id: string;
  name: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  status: "Active" | "New";
}

export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim().slice(0, 120) || "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(50, Math.max(1, Number(url.searchParams.get("pageSize") ?? 10) || 10));

  const filters = [eq(users.role, "customer")];
  if (q) {
    const term = `%${q}%`;
    const search = or(
      ilike(users.name, term),
      ilike(users.email, term),
      ilike(users.city, term),
      ilike(users.phone, term),
    );
    if (search) filters.push(search);
  }

  try {
    const where = and(...filters);
    const [rows, countRows] = await Promise.all([
      db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          phone: users.phone,
          city: users.city,
          createdAt: users.createdAt,
          emailVerified: users.emailVerified,
          orderCount: sql<number>`count(${orders.id})::int`,
          spent: sql<string>`coalesce(sum(${orders.total}), 0)`,
        })
        .from(users)
        .leftJoin(orders, eq(orders.userId, users.id))
        .where(where)
        .groupBy(users.id)
        .orderBy(desc(users.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ id: users.id }).from(users).where(where),
    ]);

    const customers: AdminCustomerView[] = rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone ?? "",
      city: row.city ?? "",
      orders: Number(row.orderCount),
      spent: Number(row.spent),
      joined: row.createdAt.toISOString(),
      status:
        Date.now() - row.createdAt.getTime() < 30 * 86_400_000 ? "New" : "Active",
    }));

    const [summary] = await db
      .select({
        totalSpend: sql<string>`coalesce(sum(${orders.total}), 0)`,
      })
      .from(orders)
      .innerJoin(users, eq(orders.userId, users.id))
      .where(eq(users.role, "customer"));

    return NextResponse.json({
      customers,
      total: countRows.length,
      newCount: customers.filter((customer) => customer.status === "New").length,
      totalSpend: Number(summary?.totalSpend ?? 0),
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[admin customers] list failed:", error);
    return jsonError("Could not load customers.", 500);
  }
}
