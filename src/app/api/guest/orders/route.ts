import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { and, eq } from "drizzle-orm";
import { z } from "zod";

import { badRequest } from "@/lib/account-api";
import { mapOrder, resolveUnitPrice, orderSchema } from "@/lib/account-api";
import { generateOrderId } from "@/lib/orders";
import { sendOrderReceiptEmail } from "@/lib/email";
import { db } from "@/lib/db";
import { orderItems, orders } from "@/lib/db/schema";

const guestOrderSchema = orderSchema.extend({
  email: z.string().trim().email().max(160),
});

const hits = new Map<string, { count: number; resetAt: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const entry = hits.get(ip);
  if (!entry || entry.resetAt <= now) {
    hits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 5;
}

/** Guest checkout — no session required, but a private token is returned. */
export async function POST(request: Request) {
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (throttled(ip)) return badRequest("Too many orders. Try again shortly.");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = guestOrderSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return badRequest(
      issue ? `${issue.path.join(".")} — ${issue.message}` : "Invalid order.",
    );
  }
  const body = parsed.data;
  const email = body.email.toLowerCase();

  const priced = await Promise.all(
    body.items.map(async (item) => ({
      item,
      price: await resolveUnitPrice(item.slug, item.kind),
    })),
  );
  if (priced.some((entry) => entry.price === null)) {
    return badRequest("An item is no longer available. Refresh your cart.");
  }
  const subtotal = priced.reduce(
    (sum, entry) => sum + entry.price! * entry.item.quantity,
    0,
  );
  const total = subtotal + body.deliveryCharge;
  if (Math.abs(total - body.total) > 1) {
    return badRequest("The order total no longer matches the catalogue prices.");
  }

  const id = generateOrderId();
  const guestToken = randomUUID();
  try {
    await db.transaction(async (tx) => {
      await tx.insert(orders).values({
        id,
        userId: null,
        status: "confirmed",
        paymentStatus: "pending",
        subtotal: subtotal.toFixed(2),
        deliveryCharge: body.deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: body.paymentMethod,
        paymentNumber: body.paymentNumber || null,
        deliveryMethod: body.deliveryMethod,
        addressSnapshot: { ...body.address, email },
        note: body.note || null,
        guestToken,
      });
      await tx.insert(orderItems).values(
        priced.map((entry) => ({
          id: randomUUID(),
          orderId: id,
          bookSlug: entry.item.slug,
          kind: entry.item.kind,
          titleSnapshot: entry.item.title,
          meta: entry.item.meta || null,
          price: entry.price!.toFixed(2),
          quantity: entry.item.quantity,
        })),
      );
    });

    const items = await db
      .select()
      .from(orderItems)
      .where(eq(orderItems.orderId, id));
    const mapped = mapOrder(
      {
        id,
        createdAt: new Date(),
        subtotal: subtotal.toFixed(2),
        deliveryCharge: body.deliveryCharge.toFixed(2),
        total: total.toFixed(2),
        paymentMethod: body.paymentMethod,
        paymentNumber: body.paymentNumber || null,
        deliveryMethod: body.deliveryMethod,
        addressSnapshot: { ...body.address, email },
        note: body.note || null,
        status: "confirmed",
      },
      items.map((item) => ({
        slug: item.bookSlug ?? "",
        kind: item.kind as "book" | "sunnah" | "audio",
        title: item.titleSnapshot,
        meta: item.meta ?? undefined,
        price: Number(item.price),
        quantity: item.quantity,
      })),
    );

    try {
      await sendOrderReceiptEmail({
        email,
        order: {
          id: mapped.id,
          createdAt: mapped.createdAt,
          total: mapped.total,
          subtotal: mapped.subtotal,
          deliveryCharge: mapped.deliveryCharge,
          paymentMethod: mapped.paymentMethod,
          deliveryMethod: mapped.deliveryMethod,
          address: { ...body.address, email } as unknown as Record<string, unknown>,
          items: mapped.items.map((item) => ({
            title: item.title,
            quantity: item.quantity,
            price: item.price,
          })),
        },
      });
    } catch (error) {
      console.error("[guest orders] receipt email failed:", error);
    }

    return NextResponse.json({ order: mapped, token: guestToken }, { status: 201 });
  } catch (error) {
    console.error("[guest orders] create failed:", error);
    return NextResponse.json({ error: "Could not place the order." }, { status: 500 });
  }
}

/** Guest order lookup using the private token from checkout. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const id = url.searchParams.get("id")?.trim().slice(0, 40) || "";
  const token = url.searchParams.get("token")?.trim().slice(0, 80) || "";
  const email = url.searchParams.get("email")?.trim().toLowerCase().slice(0, 160) || "";
  if (!id || (!token && !email)) {
    return badRequest("Enter your order number and email address.");
  }

  const [row] = token
    ? await db
        .select()
        .from(orders)
        .where(and(eq(orders.id, id), eq(orders.guestToken, token)))
        .limit(1)
    : await db.select().from(orders).where(eq(orders.id, id)).limit(1);
  if (!row) return badRequest("Order not found. Check your order number and email.");
  if (
    !token &&
    (row.userId ||
      (row.addressSnapshot as { email?: string })?.email?.toLowerCase() !== email)
  ) {
    return badRequest("That email does not match this order.");
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, id));
  return NextResponse.json({
    order: mapOrder(row, items.map((item) => ({
      slug: item.bookSlug ?? "",
      kind: item.kind as "book" | "sunnah" | "audio",
      title: item.titleSnapshot,
      meta: item.meta ?? undefined,
      price: Number(item.price),
      quantity: item.quantity,
    }))),
  });
}
