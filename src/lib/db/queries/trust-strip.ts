import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  TRUST_CONTENT_KEY,
  cloneTrustDefaults,
  type TrustContent,
} from "@/lib/trust-content";
import { trustContentSchema } from "@/lib/trust-schema";

/**
 * The trust-strip document, cached as part of the static shell.
 *
 * Tagged `content` and `content:trust-strip`; the save action expires both so
 * an admin edit shows up on the next request instead of waiting out cacheLife.
 * A missing row, a legacy shape or a database outage all fall back to the
 * built-in sample cards — the homepage must never fail because of a quick link.
 */
export async function getTrustContent(): Promise<TrustContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${TRUST_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, TRUST_CONTENT_KEY))
      .limit(1);

    const parsed = trustContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) {
        console.warn(
          "[trust-strip] stored document failed validation, using sample cards:",
          parsed.error.issues[0]?.message,
        );
      }
      return cloneTrustDefaults();
    }

    return {
      cards: parsed.data.cards.map((card, index) => ({
        ...card,
        id: card.id || `card-${index}`,
      })),
    };
  } catch (error) {
    console.error("[trust-strip] content_blocks read failed, using sample cards:", error);
    return cloneTrustDefaults();
  }
}
