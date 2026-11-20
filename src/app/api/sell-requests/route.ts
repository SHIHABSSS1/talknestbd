import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { sellRequests } from "@/lib/db/schema";
import {
  createSellRequestSchema,
  deleteSellRequestSchema,
  updateSellRequestSchema,
} from "@/lib/sell-request-schema";
import type { SellRequest } from "@/lib/sell-requests";

/** Simple process-local throttle for the anonymous submit endpoint. */
const submitWindowMs = 60_000;
const submitLimit = 8;
const submitHits = new Map<string, { count: number; resetAt: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  // Keep the process-local map bounded even under many unique addresses.
  if (submitHits.size > 500) {
    for (const [key, value] of submitHits) {
      if (value.resetAt <= now) submitHits.delete(key);
    }
    if (submitHits.size > 500) submitHits.clear();
  }
  const entry = submitHits.get(ip);
  if (!entry || entry.resetAt <= now) {
    submitHits.set(ip, { count: 1, resetAt: now + submitWindowMs });
    return false;
  }
  entry.count += 1;
  return entry.count > submitLimit;
}

function clientIp(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  return forwarded?.split(",")[0]?.trim() || "local";
}

function toRequest(row: typeof sellRequests.$inferSelect): SellRequest {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    name: row.name,
    phone: row.phone,
    email: row.email ?? "",
    address: row.address,
    bookTitle: row.bookTitle,
    purchasePrice: Number(row.purchasePrice),
    condition: row.condition,
    rate: Number(row.rate),
    amount: Number(row.amount),
    status: row.status as SellRequest["status"],
    ...(row.adminNote ? { adminNote: row.adminNote } : {}),
  };
}

async function isAdmin(request: Request): Promise<boolean> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user.role === "admin";
}

/** Cookie-authenticated admin mutations must come from our own origin. */
function validOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const appOrigin = new URL(
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ).origin;
  return origin === appOrigin;
}

/** Admin list of all requests. */
export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const rows = await db
    .select()
    .from(sellRequests)
    .orderBy(desc(sellRequests.createdAt));
  return NextResponse.json({ requests: rows.map(toRequest) });
}

/** Public submit from the calculator; the server owns id/status/userId. */
export async function POST(request: Request) {
  if (throttled(clientIp(request))) {
    return NextResponse.json({ error: "Too many requests. Try again shortly." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const parsed = createSellRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the request details." }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  const input = parsed.data;
  try {
    const [row] = await db
      .insert(sellRequests)
      .values({
        id: randomUUID(),
        userId: session?.user?.id ?? null,
        name: input.name,
        phone: input.phone,
        email: input.email || null,
        address: input.address,
        bookTitle: input.bookTitle,
        purchasePrice: input.purchasePrice.toFixed(2),
        condition: input.condition,
        rate: input.rate.toFixed(2),
        amount: input.amount.toFixed(2),
        status: "New",
      })
      .returning();
    return NextResponse.json({ request: toRequest(row) }, { status: 201 });
  } catch (error) {
    console.error("[sell-requests] create failed:", error);
    return NextResponse.json({ error: "Could not save the request. Try again." }, { status: 500 });
  }
}

/** Admin status/note update. */
export async function PATCH(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const parsed = updateSellRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
  const { id, ...patch } = parsed.data;
  const [row] = await db
    .update(sellRequests)
    .set(patch)
    .where(eq(sellRequests.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  return NextResponse.json({ request: toRequest(row) });
}

/** Admin delete. */
export async function DELETE(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  if (!validOrigin(request)) {
    return NextResponse.json({ error: "Invalid origin." }, { status: 403 });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const parsed = deleteSellRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request id." }, { status: 400 });
  }
  await db.delete(sellRequests).where(eq(sellRequests.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}
