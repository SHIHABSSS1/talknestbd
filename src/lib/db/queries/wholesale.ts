import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  WHOLESALE_CONTENT_KEY,
  cloneWholesaleDefaults,
  type WholesaleContent,
} from "@/lib/wholesale-content";
import { wholesaleContentSchema } from "@/lib/wholesale-schema";

/** The wholesale/free-order document, cached as part of the static shell. */
export async function getWholesaleContent(): Promise<WholesaleContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${WHOLESALE_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, WHOLESALE_CONTENT_KEY))
      .limit(1);
    const parsed = wholesaleContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[wholesale] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneWholesaleDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[wholesale] content_blocks read failed, using defaults:", error);
    return cloneWholesaleDefaults();
  }
}
