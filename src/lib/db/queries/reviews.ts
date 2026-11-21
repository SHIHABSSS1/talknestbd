import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  REVIEW_CONTENT_KEY,
  cloneReviewDefaults,
  type ReviewContent,
} from "@/lib/review-content";
import { reviewCopySchema } from "@/lib/review-schema";

/** Copy for the review wall and /reviews page; records come from the API. */
export async function getReviewContent(): Promise<ReviewContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${REVIEW_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, REVIEW_CONTENT_KEY))
      .limit(1);
    const parsed = reviewCopySchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[reviews] invalid stored copy, using defaults:", parsed.error.issues[0]?.message);
      return cloneReviewDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[reviews] content_blocks read failed, using defaults:", error);
    return cloneReviewDefaults();
  }
}
