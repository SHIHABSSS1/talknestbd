import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { and, desc, eq } from "drizzle-orm";

import { auth } from "@/lib/auth";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { createReviewSchema } from "@/lib/review-schema";
import { toReview } from "@/lib/review-api";

const PAGE_SIZE_MAX = 50;
const submitHits = new Map<string, { count: number; resetAt: number }>();

function throttled(ip: string): boolean {
  const now = Date.now();
  const entry = submitHits.get(ip);
  if (!entry || entry.resetAt <= now) {
    submitHits.set(ip, { count: 1, resetAt: now + 60_000 });
    return false;
  }
  entry.count += 1;
  return entry.count > 6;
}

/** Published reviews for the storefront — approved only, with pinned feature. */
export async function GET(request: Request) {
  const url = new URL(request.url);
  const bookSlug = url.searchParams.get("bookSlug")?.trim().slice(0, 160) || "";
  const kindParam = url.searchParams.get("kind");
  const kind = kindParam === "audio" || kindParam === "book" ? kindParam : "";
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number(url.searchParams.get("pageSize") ?? 12) || 12),
  );

  try {
    const filters = [eq(reviews.status, "approved")];
    if (bookSlug) filters.push(eq(reviews.bookSlug, bookSlug));
    if (kind) filters.push(eq(reviews.bookKind, kind));

    const [rows, countRows, pinnedRows] = await Promise.all([
      db
        .select()
        .from(reviews)
        .where(and(...filters))
        .orderBy(desc(reviews.pinned), desc(reviews.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db
        .select({ id: reviews.id })
        .from(reviews)
        .where(and(...filters)),
      db
        .select()
        .from(reviews)
        .where(and(eq(reviews.status, "approved"), eq(reviews.pinned, true)))
        .orderBy(desc(reviews.createdAt))
        .limit(6),
    ]);

    return NextResponse.json({
      reviews: rows.map(toReview),
      pinned: pinnedRows.map(toReview),
      total: countRows.length,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[reviews] list failed:", error);
    return NextResponse.json({ error: "Could not load reviews." }, { status: 500 });
  }
}

/** Logged-in reader submits a review for moderation. */
export async function POST(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  if (!session) {
    return NextResponse.json({ error: "Sign in to submit a review." }, { status: 401 });
  }
  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() || "local";
  if (throttled(ip)) {
    return NextResponse.json({ error: "Too many reviews. Try again shortly." }, { status: 429 });
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "Expected a JSON body." }, { status: 400 });
  }
  const parsed = createReviewSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return NextResponse.json(
      { error: issue ? `${issue.path.join(".")} — ${issue.message}` : "Invalid review." },
      { status: 400 },
    );
  }

  const input = parsed.data;
  try {
    const [row] = await db
      .insert(reviews)
      .values({
        id: randomUUID(),
        userId: session.user.id,
        source: "user",
        status: "pending",
        pinned: false,
        rating: input.rating,
        title: input.title,
        text: input.text,
        bookSlug: input.bookSlug,
        bookTitle: input.bookTitle,
        bookKind: input.kind,
        name: session.user.name || "TalkNest reader",
        location: input.location || session.user.city || "",
        avatarColor: "#1877F2",
        verified: true,
      })
      .returning();
    return NextResponse.json({ review: toReview(row) }, { status: 201 });
  } catch (error) {
    console.error("[reviews] submit failed:", error);
    return NextResponse.json({ error: "Could not submit the review." }, { status: 500 });
  }
}
