"use server";

import { randomUUID } from "node:crypto";

import { revalidateTag } from "next/cache";
import { and, asc, desc, eq, sql } from "drizzle-orm";
import type { z } from "zod";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import {
  contentBlocks,
  discussionLikes,
  discussions,
  quizAttempts,
  quizQuestions,
  quizzes,
  videos,
} from "@/lib/db/schema";
import {
  cloneVideoQuizDefaults,
  VIDEO_QUIZ_CONTENT_KEY,
  type VideoQuizCopy,
} from "@/lib/video-quiz-content";
import type { SaveResult } from "@/lib/video-quiz-api";
import {
  adminReplySchema,
  createQuizSchema,
  createVideoSchema,
  discussionCreateSchema,
  discussionModerateSchema,
  idSchema,
  quizAttemptSchema,
  updateQuizSchema,
  updateVideoSchema,
  videoQuizCopySchema,
} from "@/lib/video-quiz-schema";
import { slugify } from "@/lib/slug";
import { parseYouTubeId } from "@/lib/youtube";

// These actions are also called from Route Handlers, where updateTag is not
// available. revalidateTag(tag, profile) works in both contexts.
function expire(...tags: string[]): void {
  for (const tag of tags) revalidateTag(tag, "max");
}

function copyTags(): void {
  expire("content", "content:video-quiz", "video", "quiz");
}

async function guard(): Promise<boolean> {
  return isAdminSession(await getServerSession());
}

function fail(issue?: { path: readonly PropertyKey[]; message: string }, fallback = "Invalid input."): SaveResult {
  return {
    ok: false,
    message: issue ? `${issue.path.join(".")} — ${issue.message}` : fallback,
  };
}

export async function saveVideoQuizCopy(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to save changes." };
  const parsed = videoQuizCopySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid copy.");
  try {
    await db
      .insert(contentBlocks)
      .values({ key: VIDEO_QUIZ_CONTENT_KEY, data: parsed.data })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: parsed.data, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[video-quiz] copy save failed:", error);
    return { ok: false, message: "Could not save: database error." };
  }
  copyTags();
  return { ok: true, message: "Saved — the video and quiz pages are live for everyone." };
}

export async function resetVideoQuizCopy(): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to reset." };
  await db.delete(contentBlocks).where(eq(contentBlocks.key, VIDEO_QUIZ_CONTENT_KEY));
  copyTags();
  return { ok: true, message: "Restored the original video & quiz copy." };
}

async function uniqueSlug(title: string, currentId?: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (true) {
    const [row] = await db
      .select({ id: videos.id })
      .from(videos)
      .where(eq(videos.slug, candidate))
      .limit(1);
    if (!row || row.id === currentId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

function videoValues(input: z.infer<typeof createVideoSchema>, slug: string) {
  const youtubeId = input.source === "youtube" ? parseYouTubeId(input.youtubeUrl ?? "") : null;
  return {
    slug,
    title: input.title,
    description: input.description,
    category: input.category,
    host: input.host,
    episode: input.episode,
    duration: input.duration,
    views: input.views,
    thumbnail: input.thumbnail,
    source: input.source,
    youtubeId,
    videoUrl: input.source === "upload" ? input.videoUrl || null : null,
    featured: input.featured,
    status: input.status,
    publishedAt: input.status === "published" ? new Date() : null,
  };
}

export async function createVideo(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to add a video." };
  const parsed = createVideoSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid video.");
  try {
    const slug = await uniqueSlug(parsed.data.title);
    await db.insert(videos).values({ id: randomUUID(), ...videoValues(parsed.data, slug) });
  } catch (error) {
    console.error("[video-quiz] video create failed:", error);
    return { ok: false, message: "Could not create the video." };
  }
  copyTags();
  return { ok: true, message: "Video saved." };
}

export async function updateVideo(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to edit." };
  const parsedPatch = updateVideoSchema.safeParse(input);
  if (!parsedPatch.success) return fail(parsedPatch.error.issues[0], "Invalid update.");
  const { id, ...patch } = parsedPatch.data;
  const [existing] = await db.select().from(videos).where(eq(videos.id, id)).limit(1);
  if (!existing) return { ok: false, message: "Video not found." };

  const candidate = {
    title: existing.title,
    description: existing.description,
    category: existing.category,
    host: existing.host,
    episode: existing.episode,
    duration: existing.duration,
    views: existing.views,
    thumbnail: existing.thumbnail,
    source: existing.source as "youtube" | "upload",
    youtubeUrl: existing.youtubeId ?? "",
    videoUrl: existing.videoUrl ?? "",
    featured: existing.featured,
    status: existing.status as "draft" | "published",
    ...patch,
  };
  const validated = createVideoSchema.safeParse(candidate);
  if (!validated.success) return fail(validated.error.issues[0], "Invalid video.");

  try {
    const slug = patch.title
      ? await uniqueSlug(validated.data.title, id)
      : existing.slug;
    await db
      .update(videos)
      .set({
        ...videoValues(validated.data, slug),
        publishedAt:
          validated.data.status === "published"
            ? existing.publishedAt ?? new Date()
            : null,
        updatedAt: new Date(),
      })
      .where(eq(videos.id, id));
  } catch (error) {
    console.error("[video-quiz] video update failed:", error);
    return { ok: false, message: "Could not update the video." };
  }
  copyTags();
  return { ok: true, message: "Video updated." };
}

export async function deleteVideo(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to delete." };
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid video id." };
  await db.delete(videos).where(eq(videos.id, parsed.data.id));
  copyTags();
  return { ok: true, message: "Video deleted." };
}

async function writeQuestions(quizId: string, questions?: ReturnType<typeof parsedQuestions>) {
  await db.delete(quizQuestions).where(eq(quizQuestions.quizId, quizId));
  if (!questions?.length) return;
  await db.insert(quizQuestions).values(
    questions.map((question, position) => ({
      id: question.id || randomUUID(),
      quizId,
      position,
      question: question.question,
      options: question.options,
      answerIndex: question.answerIndex,
      explanation: question.explanation,
      marks: question.marks,
    })),
  );
}

function parsedQuestions(value: unknown) {
  return value as
    | {
        id?: string;
        question: string;
        options: string[];
        answerIndex: number;
        explanation: string;
        marks: number;
      }[]
    | undefined;
}

async function uniqueQuizSlug(title: string, currentId?: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (true) {
    const [row] = await db
      .select({ id: quizzes.id })
      .from(quizzes)
      .where(eq(quizzes.slug, candidate))
      .limit(1);
    if (!row || row.id === currentId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

function quizValues(
  input: {
    title: string;
    description: string;
    category: string;
    instructions: string;
    type: "book" | "watch" | "general";
    videoId?: string | null;
    durationMinutes: number;
    featured: boolean;
    status: "draft" | "published";
  },
  slug: string,
) {
  return {
    slug,
    title: input.title,
    description: input.description,
    category: input.category,
    instructions: input.instructions,
    type: input.type,
    videoId: input.videoId || null,
    durationMinutes: input.durationMinutes,
    featured: input.featured,
    status: input.status,
  };
}

export async function createQuiz(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to add a quiz." };
  const parsed = createQuizSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid quiz.");
  if (parsed.data.videoId) {
    const [video] = await db.select({ id: videos.id }).from(videos).where(eq(videos.id, parsed.data.videoId)).limit(1);
    if (!video) return { ok: false, message: "The selected video no longer exists." };
  }
  const id = randomUUID();
  try {
    await db.insert(quizzes).values({ id, ...quizValues(parsed.data, await uniqueQuizSlug(parsed.data.title)) });
    await writeQuestions(id, parsedQuestions(parsed.data.questions));
  } catch (error) {
    console.error("[video-quiz] quiz create failed:", error);
    return { ok: false, message: "Could not create the quiz." };
  }
  copyTags();
  return { ok: true, message: "Quiz published." };
}

export async function updateQuiz(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to edit." };
  const parsedPatch = updateQuizSchema.safeParse(input);
  if (!parsedPatch.success) return fail(parsedPatch.error.issues[0], "Invalid update.");
  const { id, ...patch } = parsedPatch.data;
  const [existing] = await db.select().from(quizzes).where(eq(quizzes.id, id)).limit(1);
  if (!existing) return { ok: false, message: "Quiz not found." };

  const existingQuestions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, id))
    .orderBy(asc(quizQuestions.position));
  const candidate = {
    title: existing.title,
    description: existing.description,
    category: existing.category,
    instructions: existing.instructions,
    type: existing.type as "book" | "watch" | "general",
    videoId: existing.videoId,
    durationMinutes: existing.durationMinutes,
    featured: existing.featured,
    status: existing.status as "draft" | "published",
    questions: existingQuestions.map((question) => ({
      id: question.id,
      question: question.question,
      options: question.options,
      answerIndex: question.answerIndex,
      explanation: question.explanation,
      marks: question.marks,
    })),
    ...patch,
  };
  const validated = createQuizSchema.safeParse(candidate);
  if (!validated.success) return fail(validated.error.issues[0], "Invalid quiz.");
  if (validated.data.videoId) {
    const [video] = await db.select({ id: videos.id }).from(videos).where(eq(videos.id, validated.data.videoId)).limit(1);
    if (!video) return { ok: false, message: "The selected video no longer exists." };
  }
  try {
    const slug = patch.title ? await uniqueQuizSlug(validated.data.title, id) : existing.slug;
    await db
      .update(quizzes)
      .set({ ...quizValues(validated.data, slug), updatedAt: new Date() })
      .where(eq(quizzes.id, id));
    await writeQuestions(id, parsedQuestions(validated.data.questions));
  } catch (error) {
    console.error("[video-quiz] quiz update failed:", error);
    return { ok: false, message: "Could not update the quiz." };
  }
  copyTags();
  return { ok: true, message: "Quiz updated." };
}

export async function deleteQuiz(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to delete." };
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid quiz id." };
  await db.delete(quizzes).where(eq(quizzes.id, parsed.data.id));
  copyTags();
  return { ok: true, message: "Quiz deleted." };
}

/** Storefront comment post. Identity always comes from the server session. */
export async function postDiscussion(input: unknown): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in to join the discussion." };
  const parsed = discussionCreateSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid comment.");
  const { target, targetId, body, parentId } = parsed.data;

  // Verify the thread exists and is published.
  const exists =
    target === "video"
      ? await db.select({ id: videos.id }).from(videos).where(eq(videos.id, targetId)).limit(1)
      : await db.select({ id: quizzes.id }).from(quizzes).where(eq(quizzes.id, targetId)).limit(1);
  if (!exists.length) return { ok: false, message: "That discussion is no longer available." };

  // Lightweight anti-spam: one comment per 10 seconds per reader.
  const recent = await db
    .select({ id: discussions.id })
    .from(discussions)
    .where(
      and(
        eq(discussions.userId, session.user.id),
        sql`${discussions.createdAt} > now() - interval '10 seconds'`,
      ),
    )
    .limit(1);
  if (recent.length) return { ok: false, message: "Please wait a moment before posting again." };

  try {
    await db.insert(discussions).values({
      id: randomUUID(),
      target,
      targetId,
      userId: session.user.id,
      userName: session.user.name,
      userImage: session.user.image ?? null,
      body,
      parentId: parentId || null,
      isAdmin: session.user.role === "admin",
    });
  } catch (error) {
    console.error("[video-quiz] comment failed:", error);
    return { ok: false, message: "Could not post your comment." };
  }
  expire("discussions");
  return { ok: true, message: "Your comment was added." };
}

/** Admin reply, hide/show, edit or delete a discussion entry. */
export async function moderateDiscussion(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = discussionModerateSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid update.");
  const { id, status, body } = parsed.data;
  const [existing] = await db.select().from(discussions).where(eq(discussions.id, id)).limit(1);
  if (!existing) return { ok: false, message: "Comment not found." };
  const patch: Record<string, unknown> = { updatedAt: new Date() };
  if (status) patch.status = status;
  if (body) patch.body = body;
  await db.update(discussions).set(patch).where(eq(discussions.id, id));
  expire("discussions");
  return { ok: true, message: "Discussion updated." };
}

export async function deleteDiscussion(input: unknown): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in required." };
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid comment id." };
  const [row] = await db.select().from(discussions).where(eq(discussions.id, parsed.data.id)).limit(1);
  if (!row) return { ok: false, message: "Comment not found." };
  if (row.userId !== session.user.id && session.user.role !== "admin") {
    return { ok: false, message: "You can only delete your own comments." };
  }
  await db.delete(discussions).where(eq(discussions.id, row.id));
  expire("discussions");
  return { ok: true, message: "Comment deleted." };
}

/** Admin reply that is visibly distinguished from a reader comment. */
export async function replyToDiscussion(input: unknown): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session || session.user.role !== "admin") {
    return { ok: false, message: "Admin access required." };
  }
  const parsed = adminReplySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid reply.");
  const { body, parentId, target, targetId } = parsed.data;
  const [parent] = await db.select().from(discussions).where(eq(discussions.id, parentId)).limit(1);
  if (!parent) return { ok: false, message: "Comment not found." };
  await db.insert(discussions).values({
    id: randomUUID(),
    target,
    targetId,
    userId: session.user.id,
    userName: session.user.name,
    userImage: session.user.image ?? null,
    body,
    parentId,
    isAdmin: true,
  });
  expire("discussions");
  return { ok: true, message: "Admin reply posted." };
}

export async function toggleDiscussionLike(input: unknown): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in to like comments." };
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid comment id." };
  const [existing] = await db
    .select()
    .from(discussionLikes)
    .where(
      and(
        eq(discussionLikes.discussionId, parsed.data.id),
        eq(discussionLikes.userId, session.user.id),
      ),
    )
    .limit(1);
  if (existing) {
    await db
      .delete(discussionLikes)
      .where(
        and(
          eq(discussionLikes.discussionId, parsed.data.id),
          eq(discussionLikes.userId, session.user.id),
        ),
      );
    await db
      .update(discussions)
      .set({ likes: sql`greatest(0, ${discussions.likes} - 1)` })
      .where(eq(discussions.id, parsed.data.id));
    return { ok: true, message: "Like removed." };
  }
  await db
    .insert(discussionLikes)
    .values({ discussionId: parsed.data.id, userId: session.user.id })
    .onConflictDoNothing();
  await db
    .update(discussions)
    .set({ likes: sql`${discussions.likes} + 1` })
    .where(eq(discussions.id, parsed.data.id));
  return { ok: true, message: "Liked." };
}

export type AttemptResult = {
  ok: boolean;
  message: string;
  score?: number;
  totalMarks?: number;
  percentage?: number;
  rank?: number | null;
};

/** Scores are recomputed here — a browser cannot submit a result or rank. */
export async function submitQuizAttempt(quizId: string, input: unknown): Promise<AttemptResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in to save your score." };
  const parsed = quizAttemptSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid answers." };

  const [quiz] = await db
    .select()
    .from(quizzes)
    .where(and(eq(quizzes.id, quizId), eq(quizzes.status, "published")))
    .limit(1);
  if (!quiz) return { ok: false, message: "Quiz not available." };
  const questions = await db
    .select()
    .from(quizQuestions)
    .where(eq(quizQuestions.quizId, quizId))
    .orderBy(asc(quizQuestions.position));
  if (!questions.length) return { ok: false, message: "This quiz has no questions yet." };

  // Rate limit: one submission per quiz per 20 seconds.
  const recent = await db
    .select({ id: quizAttempts.id })
    .from(quizAttempts)
    .where(
      and(
        eq(quizAttempts.userId, session.user.id),
        eq(quizAttempts.quizId, quizId),
        sql`${quizAttempts.createdAt} > now() - interval '20 seconds'`,
      ),
    )
    .limit(1);
  if (recent.length) return { ok: false, message: "Please wait a moment before submitting again." };

  const answers = parsed.data.answers;
  if (answers.length > questions.length) return { ok: false, message: "Too many answers." };
  let score = 0;
  questions.forEach((question, index) => {
    const answer = answers[index];
    if (Number.isInteger(answer) && answer >= 0 && answer < question.options.length && answer === question.answerIndex) {
      score += question.marks;
    }
  });
  const totalMarks = questions.reduce((sum, question) => sum + question.marks, 0);
  const percentage = totalMarks > 0 ? Math.round((score / totalMarks) * 100) : 0;

  try {
    await db.insert(quizAttempts).values({
      id: randomUUID(),
      quizId,
      userId: session.user.id,
      score,
      totalMarks,
      percentage,
      answers,
      seconds: parsed.data.seconds,
    });
  } catch (error) {
    console.error("[video-quiz] attempt save failed:", error);
    return { ok: false, message: "Could not save your result." };
  }
  expire("leaderboard", "quiz");

  // Rank from the best attempt per reader for this quiz.
  const ranked = await db
    .select({ userId: quizAttempts.userId })
    .from(quizAttempts)
    .where(eq(quizAttempts.quizId, quizId))
    .orderBy(desc(quizAttempts.percentage), desc(quizAttempts.score), asc(quizAttempts.createdAt));
  const seen = new Set<string>();
  let rank: number | null = null;
  let position = 0;
  for (const row of ranked) {
    if (seen.has(row.userId)) continue;
    seen.add(row.userId);
    position += 1;
    if (row.userId === session.user.id) {
      rank = position;
      break;
    }
  }
  return { ok: true, message: "Result saved.", score, totalMarks, percentage, rank };
}

export type { VideoQuizCopy };
