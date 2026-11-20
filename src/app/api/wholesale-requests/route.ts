import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wholesaleRequests } from "@/lib/db/schema";
import {
  createWholesaleRequestSchema,
  deleteWholesaleRequestSchema,
  updateWholesaleRequestSchema,
} from "@/lib/wholesale-request-schema";
import type { WholesaleRequest } from "@/lib/wholesale-requests";

const submitWindowMs = 60_000;
const submitLimit = 8;
const submitHits = new Map<string, { count: number; resetAt: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
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
  return request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
}

function toRequest(row: typeof wholesaleRequests.$inferSelect): WholesaleRequest {
  return {
    id: row.id,
    createdAt: row.createdAt.toISOString(),
    organization: row.organization,
    contact: row.contact,
    phone: row.phone,
    email: row.email ?? "",
    city: row.city,
    quantity: row.quantity,
    message: row.message,
    status: row.status as WholesaleRequest["status"],
    ...(row.adminNote ? { adminNote: row.adminNote } : {}),
  };
}

async function isAdmin(request: Request): Promise<boolean> {
  const session = await auth.api.getSession({ headers: request.headers });
  return session?.user.role === "admin";
}

function validOrigin(request: Request): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return true;
  const appOrigin = new URL(
    process.env.BETTER_AUTH_URL ?? process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000",
  ).origin;
  return origin === appOrigin;
}

export async function GET(request: Request) {
  if (!(await isAdmin(request))) {
    return NextResponse.json({ error: "Admin access required." }, { status: 403 });
  }
  const rows = await db
    .select()
    .from(wholesaleRequests)
    .orderBy(desc(wholesaleRequests.createdAt));
  return NextResponse.json({ requests: rows.map(toRequest) });
}

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
  const parsed = createWholesaleRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Please check the request details." }, { status: 400 });
  }

  const session = await auth.api.getSession({ headers: request.headers });
  const input = parsed.data;
  try {
    const [row] = await db
      .insert(wholesaleRequests)
      .values({
        id: randomUUID(),
        userId: session?.user?.id ?? null,
        organization: input.organization,
        contact: input.contact,
        phone: input.phone,
        email: input.email || null,
        city: input.city,
        quantity: input.quantity,
        message: input.message,
        status: "New",
      })
      .returning();
    return NextResponse.json({ request: toRequest(row) }, { status: 201 });
  } catch (error) {
    console.error("[wholesale-requests] create failed:", error);
    return NextResponse.json({ error: "Could not save the request. Try again." }, { status: 500 });
  }
}

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
  const parsed = updateWholesaleRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid update." }, { status: 400 });
  }
  const { id, ...patch } = parsed.data;
  const [row] = await db
    .update(wholesaleRequests)
    .set(patch)
    .where(eq(wholesaleRequests.id, id))
    .returning();
  if (!row) return NextResponse.json({ error: "Request not found." }, { status: 404 });
  return NextResponse.json({ request: toRequest(row) });
}

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
  const parsed = deleteWholesaleRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: "Invalid request id." }, { status: 400 });
  }
  await db.delete(wholesaleRequests).where(eq(wholesaleRequests.id, parsed.data.id));
  return NextResponse.json({ ok: true });
}
