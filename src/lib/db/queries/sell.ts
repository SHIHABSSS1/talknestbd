import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  SELL_CONTENT_KEY,
  cloneSellDefaults,
  type SellContent,
} from "@/lib/sell-content";
import { sellContentSchema } from "@/lib/sell-schema";

/** The sell-used-books document, cached as part of the static shell. */
export async function getSellContent(): Promise<SellContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${SELL_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, SELL_CONTENT_KEY))
      .limit(1);
    const parsed = sellContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[sell] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneSellDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[sell] content_blocks read failed, using defaults:", error);
    return cloneSellDefaults();
  }
}
