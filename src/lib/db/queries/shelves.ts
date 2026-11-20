import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  INTERNATIONAL_SHELF_KEY,
  NEW_ARRIVALS_SHELF_KEY,
  STUDENT_SHELF_KEY,
  SUNNAH_SHELF_KEY,
  TRENDING_SHELF_KEY,
  UP_SALE_SHELF_KEY,
  VIRAL_SHELF_KEY,
  cloneInternationalShelfDefaults,
  cloneNewArrivalsShelfDefaults,
  cloneStudentShelfDefaults,
  cloneSunnahShelfDefaults,
  cloneTrendingShelfDefaults,
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

/** The New Arrivals document, following the same cache/tag contract. */
export async function getNewArrivalsShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${NEW_ARRIVALS_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, NEW_ARRIVALS_SHELF_KEY))
      .limit(1);
    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[new-arrivals] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneNewArrivalsShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[new-arrivals] content_blocks read failed, using defaults:", error);
    return cloneNewArrivalsShelfDefaults();
  }
}

/** The Trending Now document, following the same cache/tag contract. */
export async function getTrendingShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${TRENDING_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, TRENDING_SHELF_KEY))
      .limit(1);
    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[trending] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneTrendingShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[trending] content_blocks read failed, using defaults:", error);
    return cloneTrendingShelfDefaults();
  }
}

/** The Sunnah Essentials document, following the same cache/tag contract. */
export async function getSunnahShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${SUNNAH_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, SUNNAH_SHELF_KEY))
      .limit(1);
    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[sunnah] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneSunnahShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[sunnah] content_blocks read failed, using defaults:", error);
    return cloneSunnahShelfDefaults();
  }
}

/** The International Books document, following the same cache/tag contract. */
export async function getInternationalShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${INTERNATIONAL_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, INTERNATIONAL_SHELF_KEY))
      .limit(1);
    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[international] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneInternationalShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[international] content_blocks read failed, using defaults:", error);
    return cloneInternationalShelfDefaults();
  }
}

/** The Student Books document, following the same cache/tag contract. */
export async function getStudentShelfContent(): Promise<ViralShelfContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${STUDENT_SHELF_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, STUDENT_SHELF_KEY))
      .limit(1);
    const parsed = viralShelfSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[student-books] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneStudentShelfDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[student-books] content_blocks read failed, using defaults:", error);
    return cloneStudentShelfDefaults();
  }
}
