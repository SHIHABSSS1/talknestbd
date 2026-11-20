import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { eq } from "drizzle-orm";

import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  AUTHOR_CONTENT_KEY,
  cloneAuthorDefaults,
  type AuthorContent,
} from "@/lib/author-content";
import { authorContentSchema } from "@/lib/author-schema";

export async function getAuthorContent(): Promise<AuthorContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", `content:${AUTHOR_CONTENT_KEY}`);

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, AUTHOR_CONTENT_KEY))
      .limit(1);
    const parsed = authorContentSchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[authors] invalid stored document, using defaults:", parsed.error.issues[0]?.message);
      return cloneAuthorDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[authors] content_blocks read failed, using defaults:", error);
    return cloneAuthorDefaults();
  }
}
