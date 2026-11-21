import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, desc, eq, inArray } from "drizzle-orm";

import { db } from "@/lib/db";
import { audioChapters, audiobooks, contentBlocks } from "@/lib/db/schema";
import { toAudioBookView, type AudioBookView } from "@/lib/audio-api";
import { cloneAudioDefaults, type AudioContent } from "@/lib/audio-content";
import { audioCopySchema } from "@/lib/audio-schema";

/** Page copy from content_blocks('audio'). */
export async function getAudioContent(): Promise<AudioContent> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "content:audio");

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, "audio"))
      .limit(1);
    const parsed = audioCopySchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[audio] invalid copy, using defaults:", parsed.error.issues[0]?.message);
      return cloneAudioDefaults();
    }
    // Runtime catalogue comes from /api/audiobooks; copy blocks only carry copy.
    return { ...parsed.data, books: [] };
  } catch (error) {
    console.error("[audio] copy read failed, using defaults:", error);
    return cloneAudioDefaults();
  }
}

async function loadViews(where?: ReturnType<typeof eq> | undefined): Promise<AudioBookView[]> {
  const rows = await db
    .select()
    .from(audiobooks)
    .where(where ?? eq(audiobooks.status, "published"))
    .orderBy(desc(audiobooks.featured), asc(audiobooks.slug));
  if (!rows.length) return [];
  const chapters = await db
    .select()
    .from(audioChapters)
    .where(inArray(audioChapters.audiobookId, rows.map((row) => row.id)));
  return rows.map((row) =>
    toAudioBookView(
      row,
      chapters.filter((chapter) => chapter.audiobookId === row.id),
    ),
  );
}

/** Published audiobooks for the storefront, cached in the static shell. */
export async function getPublishedAudiobooks(): Promise<AudioBookView[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "content:audio", "audio");
  return loadViews();
}

/** Every audiobook including drafts, for the admin editor. */
export async function getAllAudiobooks(): Promise<AudioBookView[]> {
  return loadViews();
}

export async function getAudiobookBySlug(slug: string): Promise<AudioBookView | null> {
  const [row] = await db
    .select()
    .from(audiobooks)
    .where(and(eq(audiobooks.slug, slug), eq(audiobooks.status, "published")))
    .limit(1);
  if (!row) return null;
  const chapters = await db
    .select()
    .from(audioChapters)
    .where(eq(audioChapters.audiobookId, row.id));
  return toAudioBookView(row, chapters);
}

/** Audiobooks the signed-in reader has unlocked through purchases. */
export async function getUnlockedAudiobooks(userId: string): Promise<AudioBookView[]> {
  const { audioUnlocks } = await import("@/lib/db/schema");
  const unlocks = await db
    .select({ slug: audioUnlocks.slug, unlockedAt: audioUnlocks.unlockedAt })
    .from(audioUnlocks)
    .where(eq(audioUnlocks.userId, userId))
    .orderBy(desc(audioUnlocks.unlockedAt));
  if (!unlocks.length) return [];
  const slugs = unlocks.map((row) => row.slug);
  const rows = await db
    .select()
    .from(audiobooks)
    .where(inArray(audiobooks.slug, slugs));
  const chapters = rows.length
    ? await db
        .select()
        .from(audioChapters)
        .where(inArray(audioChapters.audiobookId, rows.map((row) => row.id)))
    : [];
  const views = rows.map((row) =>
    toAudioBookView(row, chapters.filter((c) => c.audiobookId === row.id)),
  );
  // Preserve unlock order (most recent first).
  return slugs
    .map((slug) => views.find((view) => view.slug === slug))
    .filter((view): view is AudioBookView => Boolean(view));
}
