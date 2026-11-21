import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, count, desc, eq, inArray, sql, type SQL } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  contentBlocks,
  storyCategories,
  storyLikes,
  stories,
  users,
} from "@/lib/db/schema";
import { toStoryCategoryView, toStoryView, type StoryView } from "@/lib/story-api";
import {
  cloneStoryDefaults,
  STORIES_CONTENT_KEY,
  type StoryCopy,
} from "@/lib/story-content";
import { storyCopySchema } from "@/lib/story-schema";

/** Page copy from content_blocks('stories'). */
export async function getStoryCopy(): Promise<StoryCopy> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "content:stories");

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, STORIES_CONTENT_KEY))
      .limit(1);
    const parsed = storyCopySchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[stories] invalid copy, using defaults:", parsed.error.issues[0]?.message);
      return cloneStoryDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[stories] copy read failed, using defaults:", error);
    return cloneStoryDefaults();
  }
}

export type StoryListOptions = {
  status?: "published" | "pending" | "rejected" | "draft";
  type?: "voice" | "text" | "pdf";
  category?: string;
  q?: string;
  sort?: "latest" | "popular" | "oldest";
  limit: number;
  offset: number;
  viewerId?: string | null;
  /** Restrict to stories owned by this user (used by /api/stories/mine). */
  ownerId?: string;
};

function orderBy(sort: StoryListOptions["sort"]) {
  if (sort === "popular") return [desc(stories.likes), desc(stories.publishedAt)];
  if (sort === "oldest") return [asc(stories.publishedAt)];
  return [desc(stories.publishedAt), desc(stories.createdAt)];
}

/** Paginated story list. Viewer-specific like state is never cached. */
export async function listStories(
  options: StoryListOptions,
): Promise<{ rows: StoryView[]; total: number }> {
  const conditions: SQL[] = [];
  if (options.status) conditions.push(eq(stories.status, options.status));
  if (options.ownerId) conditions.push(eq(stories.userId, options.ownerId));
  if (options.type) conditions.push(eq(stories.type, options.type));
  if (options.category) conditions.push(eq(stories.category, options.category));
  if (options.q) {
    const needle = `%${options.q.toLowerCase()}%`;
    conditions.push(
      sql`(lower(${stories.title}) like ${needle} or lower(${stories.excerpt}) like ${needle} or lower(${stories.name}) like ${needle})`,
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;

  const [totalRow] = await db.select({ value: count() }).from(stories).where(where);
  const rows = await db
    .select({ story: stories, authorImage: users.image })
    .from(stories)
    .leftJoin(users, eq(stories.userId, users.id))
    .where(where)
    .orderBy(...orderBy(options.sort))
    .limit(options.limit)
    .offset(options.offset);

  let likedIds = new Set<string>();
  if (options.viewerId && rows.length) {
    const likes = await db
      .select({ storyId: storyLikes.storyId })
      .from(storyLikes)
      .where(
        and(
          eq(storyLikes.userId, options.viewerId),
          inArray(storyLikes.storyId, rows.map((row) => row.story.id)),
        ),
      );
    likedIds = new Set(likes.map((row) => row.storyId));
  }

  return {
    rows: rows.map((row) =>
      toStoryView(row.story, {
        authorImage: row.authorImage,
        likedByMe: likedIds.has(row.story.id),
      }),
    ),
    total: totalRow?.value ?? 0,
  };
}

export async function getPublishedStoryBySlug(
  slug: string,
  viewerId?: string | null,
): Promise<StoryView | null> {
  const [row] = await db
    .select({ story: stories, authorImage: users.image })
    .from(stories)
    .leftJoin(users, eq(stories.userId, users.id))
    .where(and(eq(stories.slug, slug), eq(stories.status, "published")))
    .limit(1);
  if (!row) return null;
  let likedByMe = false;
  if (viewerId) {
    const [like] = await db
      .select({ storyId: storyLikes.storyId })
      .from(storyLikes)
      .where(and(eq(storyLikes.storyId, row.story.id), eq(storyLikes.userId, viewerId)))
      .limit(1);
    likedByMe = Boolean(like);
  }
  return toStoryView(row.story, { authorImage: row.authorImage, likedByMe });
}

/** Raw row lookup for authorisation checks on private assets and ownership. */
export async function getStoryRow(slug: string) {
  const [row] = await db.select().from(stories).where(eq(stories.slug, slug)).limit(1);
  return row ?? null;
}

export async function getStoryRowById(id: string) {
  const [row] = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  return row ?? null;
}

/** Categories and their usage counts for the admin manager. */
export async function listCategories(): Promise<
  { id: string; name: string; slug: string; description: string; storyCount: number }[]
> {
  const rows = await db
    .select({
      category: storyCategories,
      storyCount: sql<number>`(select count(*)::int from ${stories} where ${stories.category} = ${storyCategories.name})`,
    })
    .from(storyCategories)
    .orderBy(asc(storyCategories.name));
  return rows.map((row) => ({ ...toStoryCategoryView(row.category), storyCount: row.storyCount }));
}

export async function getCategoryNames(): Promise<string[]> {
  const rows = await db
    .selectDistinct({ name: stories.category })
    .from(stories)
    .orderBy(asc(stories.category));
  return rows.map((row) => row.name);
}

export async function getStoryCounts(): Promise<{
  published: number;
  pending: number;
  total: number;
}> {
  const rows = await db
    .select({ status: stories.status, value: count() })
    .from(stories)
    .groupBy(stories.status);
  const byStatus = Object.fromEntries(rows.map((row) => [row.status, row.value]));
  return {
    published: byStatus.published ?? 0,
    pending: byStatus.pending ?? 0,
    total: rows.reduce((sum, row) => sum + row.value, 0),
  };
}
