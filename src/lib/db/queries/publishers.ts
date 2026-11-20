import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  PUBLISHER_CONTENT_KEY,
  clonePublisherDefaults,
  type PublisherContent,
} from "@/lib/publisher-content";
import { publisherContentSchema } from "@/lib/publisher-schema";

export async function getPublisherContent(): Promise<PublisherContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${PUBLISHER_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, PUBLISHER_CONTENT_KEY))
      .limit(1);
    const parsed = publisherContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[publishers] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return clonePublisherDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[publishers] content_blocks read failed, using defaults:", error);
    return clonePublisherDefaults();
  }
}
