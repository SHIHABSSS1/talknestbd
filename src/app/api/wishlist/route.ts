import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { and, asc, eq } from "drizzle-orm";

import { badRequest } from "@/lib/account-api";
import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { wishlistItems } from "@/lib/db/schema";
import {
  guestTokenSchema,
  wishlistAddSchema,
  wishlistRemoveSchema,
} from "@/lib/wishlist-schema";

/**
 * Resolves the wishlist owner. A signed-in reader always wins; anonymous
 * visitors are identified by an unguessable token stored in their browser.
 */
async function resolveOwner(
  request: Request,
  scopeGuest = false,
): Promise<string | null> {
  const raw = request.headers.get("x-guest-id");
  const parsed = raw ? guestTokenSchema.safeParse(raw) : null;
  // `scope=guest` is used during login to migrate a visitor's anonymous list.
  if (scopeGuest) return parsed?.success ? `guest_${parsed.data}` : null;
  const session = await auth.api.getSession({ headers: request.headers });
  if (session) return `user_${session.user.id}`;
  return parsed?.success ? `guest_${parsed.data}` : null;
}

function wantsGuestScope(request: Request): boolean {
  return new URL(request.url).searchParams.get("scope") === "guest";
}

export async function GET(request: Request) {
  const owner = await resolveOwner(request, wantsGuestScope(request));
  if (!owner) return badRequest("A session or guest token is required.");

  const rows = await db
    .select({ slug: wishlistItems.slug })
    .from(wishlistItems)
    .where(eq(wishlistItems.ownerKey, owner))
    .orderBy(asc(wishlistItems.createdAt));
  return NextResponse.json({ slugs: rows.map((row) => row.slug) });
}

export async function POST(request: Request) {
  const owner = await resolveOwner(request, wantsGuestScope(request));
  if (!owner) return badRequest("A session or guest token is required.");

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = wishlistAddSchema.safeParse(payload);
  if (!parsed.success) return badRequest("Invalid book slug.");

  await db
    .insert(wishlistItems)
    .values({ id: randomUUID(), ownerKey: owner, slug: parsed.data.slug })
    .onConflictDoNothing({
      target: [wishlistItems.ownerKey, wishlistItems.slug],
    });
  return NextResponse.json({ slug: parsed.data.slug }, { status: 201 });
}

export async function DELETE(request: Request) {
  const owner = await resolveOwner(request, wantsGuestScope(request));
  if (!owner) return badRequest("A session or guest token is required.");

  const url = new URL(request.url);
  if (url.searchParams.get("all") === "true") {
    await db.delete(wishlistItems).where(eq(wishlistItems.ownerKey, owner));
    return NextResponse.json({ ok: true });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return badRequest("Expected a JSON body.");
  }
  const parsed = wishlistRemoveSchema.safeParse(payload);
  if (!parsed.success) return badRequest("Invalid book slug.");

  await db
    .delete(wishlistItems)
    .where(
      and(
        eq(wishlistItems.ownerKey, owner),
        eq(wishlistItems.slug, parsed.data.slug),
      ),
    );
  return NextResponse.json({ ok: true });
}
