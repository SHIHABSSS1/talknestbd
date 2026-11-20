import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  UP_SALE_SHELF_KEY,
  VIRAL_SHELF_KEY,
  cloneUpSaleShelfDefaults,
  cloneViralShelfDefaults,
  type ViralShelfContent,
} from "@/lib/shelf-content";
import { viralShelfSchema } from "@/lib/shelf-schema";

/**
 * The Viral Books document, cached as part of the static shell. Tagged both
 * `content` and `content:shelf:viral-books`; the admin action expires them on
 * save, so adding a book publishes it for everyone on the next request.
 */
export async function getViralShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${VIRAL_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, VIRAL_SHELF_KEY))
      .limit(1);

    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) {
        console.warn(
          "[viral-books] stored document failed validation, using sample shelf:",
          parsed.error.issues[0]?.message,
        );
      }
      return cloneViralShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[viral-books] content_blocks read failed, using sample shelf:", error);
    return cloneViralShelfDefaults();
  }
}

/** The 50% Up Sale document, following the same cache/tag contract. */
export async function getUpSaleShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${UP_SALE_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, UP_SALE_SHELF_KEY))
      .limit(1);
    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[up-sale] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneUpSaleShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[up-sale] content_blocks read failed, using defaults:", error);
    return cloneUpSaleShelfDefaults();
  }
}
