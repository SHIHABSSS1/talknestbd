import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  USED_CONTENT_KEY,
  cloneUsedDefaults,
  type UsedContent,
} from "@/lib/used-content";
import { usedContentSchema } from "@/lib/used-schema";

/** The used-books banner document, cached as part of the static shell. */
export async function getUsedContent(): Promise<UsedContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${USED_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, USED_CONTENT_KEY))
      .limit(1);
    const parsed = usedContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[used] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneUsedDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[used] content_blocks read failed, using defaults:", error);
    return cloneUsedDefaults();
  }
}
