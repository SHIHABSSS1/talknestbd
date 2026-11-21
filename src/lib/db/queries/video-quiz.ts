import "server-only";

import { cacheLife, cacheTag } from "next/cache";
import { and, asc, count, desc, eq, inArray, sql } from "drizzle-orm";

import { db } from "@/lib/db";
import {
  contentBlocks,
  discussionLikes,
  discussions,
  quizAttempts,
  quizQuestions,
  quizzes,
  users,
  videos,
} from "@/lib/db/schema";
import {
  toAttemptView,
  toDiscussionView,
  toQuizView,
  toVideoView,
  type AttemptView,
  type DiscussionView,
  type LeaderboardEntry,
  type QuizView,
  type VideoView,
} from "@/lib/video-quiz-api";
import {
  cloneVideoQuizDefaults,
  VIDEO_QUIZ_CONTENT_KEY,
  type VideoQuizCopy,
} from "@/lib/video-quiz-content";
import { videoQuizCopySchema } from "@/lib/video-quiz-schema";

/** Page copy from content_blocks('video-quiz'). */
export async function getVideoQuizCopy(): Promise<VideoQuizCopy> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "content:video-quiz");

  try {
    const [row] = await db
      .select({ data: contentBlocks.data })
      .from(contentBlocks)
      .where(eq(contentBlocks.key, VIDEO_QUIZ_CONTENT_KEY))
      .limit(1);
    const parsed = videoQuizCopySchema.safeParse(row?.data);
    if (!parsed.success) {
      if (row) console.warn("[video-quiz] invalid copy, using defaults:", parsed.error.issues[0]?.message);
      return cloneVideoQuizDefaults();
    }
    return parsed.data;
  } catch (error) {
    console.error("[video-quiz] copy read failed, using defaults:", error);
    return cloneVideoQuizDefaults();
  }
}

async function loadVideos(publishedOnly: boolean): Promise<VideoView[]> {
  const rows = await db
    .select()
    .from(videos)
    .where(publishedOnly ? eq(videos.status, "published") : undefined)
    .orderBy(desc(videos.featured), desc(videos.episode), asc(videos.title));
  return rows.map(toVideoView);
}

/** Published episodes for the storefront and the homepage shelf. */
export async function getPublishedVideos(): Promise<VideoView[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "video", "videos");
  return loadVideos(true);
}

/** Every episode including drafts, for the admin manager. */
export async function getAllVideos(): Promise<VideoView[]> {
  return loadVideos(false);
}

export async function getFeaturedVideos(limit = 6): Promise<VideoView[]> {
  const rows = await db
    .select()
    .from(videos)
    .where(and(eq(videos.status, "published"), eq(videos.featured, true)))
    .orderBy(desc(videos.episode))
    .limit(limit);
  return rows.map(toVideoView);
}

export async function getVideoBySlug(slug: string): Promise<VideoView | null> {
  const [row] = await db
    .select()
    .from(videos)
    .where(and(eq(videos.slug, slug), eq(videos.status, "published")))
    .limit(1);
  return row ? toVideoView(row) : null;
}

async function loadQuizzes(publishedOnly: boolean): Promise<QuizView[]> {
  const rows = await db
    .select()
    .from(quizzes)
    .where(publishedOnly ? eq(quizzes.status, "published") : undefined)
    .orderBy(desc(quizzes.featured), desc(quizzes.createdAt));
  if (!rows.length) return [];
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(inArray(quizQuestions.quizId, rows.map((row) => row.id)))
    .orderBy(asc(quizQuestions.position));
  const videoSlugs = rows
    .map((row) => row.videoId)
    .filter((id): id is string => Boolean(id));
  const videoRows = videoSlugs.length
    ? await db
        .select({ id: videos.id, slug: videos.slug })
        .from(videos)
        .where(inArray(videos.id, videoSlugs))
    : [];
  const slugById = new Map(videoRows.map((row) => [row.id, row.slug]));
  return rows.map((row) =>
    toQuizView(
      row,
      questions.filter((question) => question.quizId === row.id),
      row.videoId ? slugById.get(row.videoId) ?? null : null,
    ),
  );
}

/** Published quizzes with their questions, for the storefront. */
export async function getPublishedQuizzes(): Promise<QuizView[]> {
  "use cache";
  cacheLife("hours");
  cacheTag("content", "quiz", "quizzes");
  return loadQuizzes(true);
}

export async function getAllQuizzes(): Promise<QuizView[]> {
  return loadQuizzes(false);
}

export async function getQuizBySlug(slug: string): Promise<QuizView | null> {
  const [row] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.slug, slug), eq(quizzes.status, "published")))
    .limit(1);
  if (!row) return null;
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, row.id))
    .orderBy(asc(quizQuestions.position));
  let videoSlug: string | null = null;
  if (row.videoId) {
    const [video] = await db
      .select({ slug: videos.slug })
      .from(videos)
      .where(eq(videos.id, row.videoId))
      .limit(1);
    videoSlug = video?.slug ?? null;
  }
  return toQuizView(row, questions, videoSlug);
}

export async function getQuizById(id: string): Promise<QuizView | null> {
  const [row] = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  if (!row) return null;
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, row.id))
    .orderBy(asc(quizQuestions.position));
  return toQuizView(row, questions);
}

/** Comments for one video/quiz. Viewer-specific like state is never cached. */
export async function getDiscussions(
  target: "video" | "quiz",
  targetId: string,
  viewerId?: string | null,
): Promise<DiscussionView[]> {
  const rows = await db
    .select()
    .from(discussions)
    .where(
      and(
        eq(discussions.target, target),
        eq(discussions.targetId, targetId),
        eq(discussions.status, "visible"),
      ),
    )
    .orderBy(desc(discussions.createdAt));
  let likedIds = new Set<string>();
  if (viewerId && rows.length) {
    const likes = await db
      .select({ discussionId: discussionLikes.discussionId })
      .from(discussionLikes)
      .where(
        and(
          eq(discussionLikes.userId, viewerId),
          inArray(
            discussionLikes.discussionId,
            rows.map((row) => row.id),
          ),
        ),
      );
    likedIds = new Set(likes.map((row) => row.discussionId));
  }
  return rows.map((row) => toDiscussionView(row, likedIds.has(row.id)));
}

/** Admin discussion list with optional filters and pagination. */
export async function getAllDiscussions(options: {
  target?: string;
  status?: string;
  q?: string;
  limit: number;
  offset: number;
}): Promise<{ rows: DiscussionView[]; total: number }> {
  const conditions = [];
  if (options.target === "video" || options.target === "quiz") {
    conditions.push(eq(discussions.target, options.target));
  }
  if (options.status === "visible" || options.status === "hidden") {
    conditions.push(eq(discussions.status, options.status));
  }
  if (options.q) {
    // Parameterised ILIKE — user input never becomes SQL text.
    const needle = `%${options.q.toLowerCase()}%`;
    conditions.push(
      sql`(lower(${discussions.body}) like ${needle} or lower(${discussions.userName}) like ${needle})`,
    );
  }
  const where = conditions.length ? and(...conditions) : undefined;
  const [totalRow] = await db.select({ value: count() }).from(discussions).where(where);
  const rows = await db
    .select()
    .from(discussions)
    .where(where)
    .orderBy(desc(discussions.createdAt))
    .limit(options.limit)
    .offset(options.offset);
  return { rows: rows.map((row) => toDiscussionView(row)), total: totalRow?.value ?? 0 };
}

/**
 * Leaderboard: the best attempt per reader (per quiz when quizId is given).
 * Scores are recomputed by the submit API, so these numbers are trustworthy.
 */
export async function getLeaderboard(options: {
  quizId?: string;
  limit?: number;
  offset?: number;
} = {}): Promise<{ entries: LeaderboardEntry[]; total: number }> {
  const rows = await db
    .select({
      attempt: quizAttempts,
      quizTitle: quizzes.title,
      userName: users.name,
      userImage: users.image,
      city: users.city,
    })
    .from(quizAttempts)
    .innerJoin(users, eq(quizAttempts.userId, users.id))
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .where(options.quizId ? eq(quizAttempts.quizId, options.quizId) : undefined)
    .orderBy(desc(quizAttempts.percentage), desc(quizAttempts.score), asc(quizAttempts.createdAt));

  const best = new Map<
    string,
    { attempt: (typeof rows)[number]["attempt"]; userName: string; userImage: string | null; city: string | null; quizTitle: string; attempts: number; quizzes: Set<string> }
  >();
  for (const row of rows) {
    const existing = best.get(row.attempt.userId);
    if (existing) {
      existing.attempts += 1;
      existing.quizzes.add(row.attempt.quizId);
      continue;
    }
    best.set(row.attempt.userId, {
      attempt: row.attempt,
      userName: row.userName,
      userImage: row.userImage,
      city: row.city,
      quizTitle: row.quizTitle,
      attempts: 1,
      quizzes: new Set([row.attempt.quizId]),
    });
  }

  const ranked = [...best.values()]
    .map((entry) => ({
      userId: entry.attempt.userId,
      name: entry.userName,
      image: entry.userImage,
      city: entry.city,
      score: entry.attempt.score,
      totalMarks: entry.attempt.totalMarks,
      percentage: entry.attempt.percentage,
      attempts: entry.attempts,
      quizzesPlayed: entry.quizzes.size,
      bestQuizTitle: entry.quizTitle,
    }))
    .sort(
      (a, b) =>
        b.percentage - a.percentage ||
        b.score - a.score ||
        a.name.localeCompare(b.name),
    );

  const all = ranked.map((entry, index) => ({ ...entry, rank: index + 1 }));
  const offset = options.offset ?? 0;
  const limit = options.limit ?? all.length;
  return { entries: all.slice(offset, offset + limit), total: all.length };
}

/** Signed-in reader's attempt history, newest first. */
export async function getAttemptsForUser(userId: string, limit = 50): Promise<AttemptView[]> {
  const rows = await db
    .select({ attempt: quizAttempts, quizTitle: quizzes.title, quizSlug: quizzes.slug })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .where(eq(quizAttempts.userId, userId))
    .orderBy(desc(quizAttempts.createdAt))
    .limit(limit);
  return rows.map((row) =>
    toAttemptView(row.attempt, row.quizTitle, row.quizSlug),
  );
}

/** Admin results table with pagination. */
export async function getAllAttempts(
  limit: number,
  offset: number,
): Promise<{ rows: AttemptView[]; total: number }> {
  const [totalRow] = await db.select({ value: count() }).from(quizAttempts);
  const rows = await db
    .select({ attempt: quizAttempts, quizTitle: quizzes.title, quizSlug: quizzes.slug })
    .from(quizAttempts)
    .innerJoin(quizzes, eq(quizAttempts.quizId, quizzes.id))
    .orderBy(desc(quizAttempts.createdAt))
    .limit(limit)
    .offset(offset);
  return {
    rows: rows.map((row) => toAttemptView(row.attempt, row.quizTitle, row.quizSlug)),
    total: totalRow?.value ?? 0,
  };
}
