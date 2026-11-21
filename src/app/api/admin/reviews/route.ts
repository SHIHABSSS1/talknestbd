import { randomUUID } from "node:crypto";

import { NextResponse } from "next/server";
import { and, desc, eq, ilike, or } from "drizzle-orm";

import { getAdminContext, jsonError, rejectCrossSite } from "@/lib/admin-api";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { toReview } from "@/lib/review-api";
import { adminCreateReviewSchema } from "@/lib/review-schema";

const PAGE_SIZE_MAX = 50;

/** Admin list with search, status/source/kind filters and pagination. */
export async function GET(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;

  const url = new URL(request.url);
  const q = url.searchParams.get("q")?.trim().slice(0, 120) || "";
  const status = url.searchParams.get("status") || "";
  const source = url.searchParams.get("source") || "";
  const kind = url.searchParams.get("kind") || "";
  const pinned = url.searchParams.get("pinned");
  const page = Math.max(1, Number(url.searchParams.get("page") ?? 1) || 1);
  const pageSize = Math.min(
    PAGE_SIZE_MAX,
    Math.max(1, Number(url.searchParams.get("pageSize") ?? 10) || 10),
  );

  const filters = [];
  if (["pending", "approved", "rejected"].includes(status)) {
    filters.push(eq(reviews.status, status));
  }
  if (["user", "admin"].includes(source)) {
    filters.push(eq(reviews.source, source));
  }
  if (["book", "audio"].includes(kind)) {
    filters.push(eq(reviews.bookKind, kind));
  }
  if (pinned === "true" || pinned === "false") {
    filters.push(eq(reviews.pinned, pinned === "true"));
  }
  if (q) {
    const term = `%${q}%`;
    const search = or(
      ilike(reviews.name, term),
      ilike(reviews.title, term),
      ilike(reviews.text, term),
      ilike(reviews.bookTitle, term),
      ilike(reviews.bookSlug, term),
    );
    if (search) filters.push(search);
  }

  try {
    const where = filters.length ? and(...filters) : undefined;
    const [rows, countRows] = await Promise.all([
      db
        .select()
        .from(reviews)
        .where(where)
        .orderBy(desc(reviews.createdAt))
        .limit(pageSize)
        .offset((page - 1) * pageSize),
      db.select({ id: reviews.id }).from(reviews).where(where),
    ]);

    return NextResponse.json({
      reviews: rows.map(toReview),
      total: countRows.length,
      page,
      pageSize,
    });
  } catch (error) {
    console.error("[admin reviews] list failed:", error);
    return jsonError("Could not load reviews.", 500);
  }
}

/** Admin-authored custom review. */
export async function POST(request: Request) {
  const guard = await getAdminContext(request);
  if (guard.error) return guard.error;
  const crossSite = rejectCrossSite(request);
  if (crossSite) return crossSite;

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return jsonError("Expected a JSON body.", 400);
  }
  const parsed = adminCreateReviewSchema.safeParse(payload);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return jsonError(issue ? `${issue.path.join(".")} — ${issue.message}` : "Invalid review.", 400);
  }
  const input = parsed.data;
  if (input.pinned && input.status !== "approved") {
    return jsonError("Only approved reviews can be pinned.", 400);
  }

  try {
    const [row] = await db
      .insert(reviews)
      .values({
        id: randomUUID(),
        userId: null,
        source: "admin",
        status: input.status,
        pinned: input.pinned,
        rating: input.rating,
        title: input.title,
        text: input.text,
        bookSlug: input.bookSlug,
        bookTitle: input.bookTitle,
        bookKind: input.kind,
        name: input.name,
        location: input.location,
        avatarColor: input.avatarColor,
        verified: true,
      })
      .returning();
    return NextResponse.json({ review: toReview(row) }, { status: 201 });
  } catch (error) {
    console.error("[admin reviews] create failed:", error);
    return jsonError("Could not create the review.", 500);
  }
}
