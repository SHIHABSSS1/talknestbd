import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  CATEGORY_CONTENT_KEY,
  cloneCategoryDefaults,
  type CategoryContent,
} from "@/lib/category-content";
import { categoryContentSchema } from "@/lib/category-schema";

/**
 * The category document (heading + tiles + subcategories), cached as part of
 * the static shell. Tagged `content` and `content:categories`; the save action
 * expires both. Missing/invalid rows and DB outages fall back to the sample
 * shelves so every category route still renders.
 */
export async function getCategoryContent(): Promise<CategoryContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${CATEGORY_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, CATEGORY_CONTENT_KEY))
      .limit(1);

    const parsed = categoryContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) {
        console.warn(
          "[categories] stored document failed validation, using sample shelves:",
          parsed.error.issues[0]?.message,
        );
      }
      return cloneCategoryDefaults();
    }

    const tiles = parsed.data.tiles.map((tile, index) => ({
      ...tile,
      id: tile.id || `category-${index}`,
      subcategories: tile.subcategories ?? [],
      homeBooks: tile.homeBooks ?? true,
    }));
    return { heading: parsed.data.heading, tiles };
  } catch (error) {
    console.error("[categories] content_blocks read failed, using sample shelves:", error);
    return cloneCategoryDefaults();
  }
}
