import { NextResponse } from "next/server";
import { desc, eq } from "drizzle-orm";

import { getApiSession, unauthorized } from "@/lib/account-api";
import { db } from "@/lib/db";
import { reviews } from "@/lib/db/schema";
import { toReview } from "@/lib/review-api";

/** All reviews belonging to the signed-in reader, including pending/rejected. */
export async function GET(request: Request) {
  const session = await getApiSession(request);
  if (!session) return unauthorized();

  const rows = await db
    .select()
    .from(reviews)
    .where(eq(reviews.userId, session.user.id))
    .orderBy(desc(reviews.createdAt));
  return NextResponse.json({ reviews: rows.map(toReview) });
}
