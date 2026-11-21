import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";

import { getApiSession, unauthorized, badRequest } from "@/lib/account-api";
import { db } from "@/lib/db";
import { cartItems } from "@/lib/db/schema";
import {
  cartItemSchema,
  cartQuantitySchema,
  cartRemoveSchema,
} from "@/lib/cart-schema";
import type { CartItem } from "@/lib/store";

function toItem(row: typeof cartItems.$inferSelect): CartItem {
  return {
    slug: row.slug,
    kind: row.kind as CartItem["kind"],
    title: row.title,
    price: Number(row.price),
    ...(row.meta ? { meta: row.meta } : {}),
    quantity: row.quantity,
  };
}

export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();
  const rows = await db
    .select()
    .from(cartItems)
    .where(eq(cartItems.userId, session.user.id))
    .orderBy(asc(cartItems.slug));
  return NextResponse.json({ items: rows.map(toItem) });
}

/** Add or merge a cart line. */
export async function POST(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = cartItemSchema.safeParse(payload);
  if (!parsed.success) return badRequest("Invalid cart item.");
  const item = parsed.data;

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.userId, session.user.id),
        eq(cartItems.slug, item.slug),
        eq(cartItems.kind, item.kind),
      ),
    )
    .limit(1);

  const [row] = await db
    .insert(cartItems)
    .values({
      userId: session.user.id,
      ...item,
      quantity: (existing?.quantity ?? 0) + item.quantity,
      price: item.price.toFixed(2),
    })
    .onConflictDoUpdate({
      target: [cartItems.userId, cartItems.slug, cartItems.kind],
      set: {
        title: item.title,
        price: item.price.toFixed(2),
        meta: item.meta ?? null,
        quantity: (existing?.quantity ?? 0) + item.quantity,
        updatedAt: new Date(),
      },
    })
    .returning();
  return NextResponse.json({ item: toItem(row) }, { status: 201 });
}

/** Set an exact quantity (0 removes the line). */
export async function PATCH(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = cartQuantitySchema.safeParse(payload);
  if (!parsed.success) return badRequest("Invalid quantity.");
  const { slug, kind, quantity } = parsed.data;

  if (quantity === 0) {
    await db
      .delete(cartItems)
      .where(
        and(
          eq(cartItems.userId, session.user.id),
          eq(cartItems.slug, slug),
          eq(cartItems.kind, kind),
        ),
      );
    return NextResponse.json({ ok: true });
  }

  const [row] = await db
    .update(cartItems)
    .set({ quantity, updatedAt: new Date() })
    .where(
      and(
        eq(cartItems.userId, session.user.id),
        eq(cartItems.slug, slug),
        eq(cartItems.kind, kind),
      ),
    )
    .returning();
  if (!row) return badRequest("Cart item not found.");
  return NextResponse.json({ item: toItem(row) });
}

export async function DELETE(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();
  const url = new URL(request.url);
  if (url.searchParams.get("all") === "true") {
    await db.delete(cartItems).where(eq(cartItems.userId, session.user.id));
    return NextResponse.json({ ok: true });
  }
  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = cartRemoveSchema.safeParse(payload);
  if (!parsed.success) return badRequest("Invalid cart item.");
  await db
    .delete(cartItems)
    .where(
      and(
        eq(cartItems.userId, session.user.id),
        eq(cartItems.slug, parsed.data.slug),
        eq(cartItems.kind, parsed.data.kind),
      ),
    );
  return NextResponse.json({ ok: true });
}
