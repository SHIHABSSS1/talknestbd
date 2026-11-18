import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  HERO_CONTENT_KEY,
  cloneHeroDefaults,
  type HeroContent,
} from "@/lib/hero-content";
import { heroContentSchema } from "@/lib/hero-schema";

/**
 * The hero document, cached as part of the static shell.
 *
 * Tagged `content` and `content:hero`; the save action expires both, so an
 * admin edit shows up on the next request instead of waiting out `cacheLife`.
 *
 * A missing row, a legacy shape or an unreachable database all resolve to the
 * built-in sample slides — the homepage must never fail because of a banner.
 * Note the trade-off: the fallback is cached too, so a database outage can keep
 * the sample slides on screen for up to an hour. That is deliberate; a blank
 * hero is worse than a stale one.
 */
export async function getHeroContent(): Promise<HeroContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${HERO_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, HERO_CONTENT_KEY))
      .limit(1);

    const parsed = heroContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) {
        console.warn(
          "[hero] stored document failed validation, using sample slides:",
          parsed.error.issues[0]?.message,
        );
      }
      return cloneHeroDefaults();
    }

    return { banners: parsed.data.banners.map((banner, index) => ({
      ...banner,
      id: banner.id || `banner-${index}`,
    })) };
  } catch (error) {
    console.error("[hero] content_blocks read failed, using sample slides:", error);
    return cloneHeroDefaults();
  }
}