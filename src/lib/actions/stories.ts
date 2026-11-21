"use server";

import { randomUUID } from "node:crypto";

import { revalidateTag } from "next/cache";
import { and, eq, sql } from "drizzle-orm";
import type { z } from "zod";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks, storyCategories, storyLikes, stories } from "@/lib/db/schema";
import type { SaveResult } from "@/lib/story-api";
import {
  cloneStoryDefaults,
  STORIES_CONTENT_KEY,
  type StoryCopy,
} from "@/lib/story-content";
import {
  categorySchema,
  idSchema,
  storyAdminCreateSchema,
  storyAdminUpdateSchema,
  storyCopySchema,
  storyModerateSchema,
  storySubmitSchema,
} from "@/lib/story-schema";
import { slugify } from "@/lib/slug";

function expire(slug?: string): void {
  revalidateTag("content", "max");
  revalidateTag("content:stories", "max");
  revalidateTag("stories", "max");
  if (slug) revalidateTag(`story:${slug}`, "max");
}

async function guard(): Promise<boolean> {
  return isAdminSession(await getServerSession());
}

function fail(issue?: { path: readonly PropertyKey[]; message: string }, fallback = "Invalid input."): SaveResult {
  return { ok: false, message: issue ? `${issue.path.join(".")} — ${issue.message}` : fallback };
}

export async function saveStoryCopy(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to save changes." };
  const parsed = storyCopySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid copy.");
  await db
    .insert(contentBlocks)
    .values({ key: STORIES_CONTENT_KEY, data: parsed.data })
    .onConflictDoUpdate({
      target: contentBlocks.key,
      set: { data: parsed.data, updatedAt: new Date() },
    });
  expire();
  return { ok: true, message: "Saved — the story pages are live for everyone." };
}

export async function resetStoryCopy(): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to reset." };
  await db.delete(contentBlocks).where(eq(contentBlocks.key, STORIES_CONTENT_KEY));
  expire();
  return { ok: true, message: "Restored the original story copy." };
}

async function uniqueSlug(title: string, currentId?: string): Promise<string> {
  const base = slugify(title);
  let candidate = base;
  let suffix = 2;
  while (true) {
    const [row] = await db
      .select({ id: stories.id })
      .from(stories)
      .where(eq(stories.slug, candidate))
      .limit(1);
    if (!row || row.id === currentId) return candidate;
    candidate = `${base}-${suffix++}`;
  }
}

type StoryInput = z.infer<typeof storyAdminCreateSchema>;

function rowValues(input: StoryInput, slug: string) {
  return {
    slug,
    name: input.name,
    title: input.title,
    excerpt: input.excerpt,
    body: input.body,
    type: input.type,
    category: input.category,
    coverUrl: input.coverUrl || null,
    avatarColor: input.avatarColor,
    duration: input.duration || null,
    audioKey: input.audioKey || null,
    attachmentKey: input.attachmentKey || null,
    attachmentName: input.attachmentName || null,
    status: input.status,
    featured: input.featured,
  };
}

/** Signed-in readers submit a pending story. The session owns the row. */
export async function submitStory(input: unknown): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in to share a story." };
  const parsed = storySubmitSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid story.");

  // Lightweight abuse protection: at most 8 submissions per reader per hour.
  const recent = await db
    .select({ id: stories.id })
    .from(stories)
    .where(
      and(
        eq(stories.userId, session.user.id),
        sql`${stories.createdAt} > now() - interval '1 hour'`,
      ),
    );
  if (recent.length >= 8) {
    return { ok: false, message: "You have submitted several stories already. Please try again later." };
  }

  const slug = await uniqueSlug(parsed.data.title);
  try {
    await db.insert(stories).values({
      id: randomUUID(),
      ...rowValues({ ...parsed.data, status: "pending", featured: false }, slug),
      userId: session.user.id,
      publishedAt: null,
    });
  } catch (error) {
    console.error("[stories] submit failed:", error);
    return { ok: false, message: "Could not submit your story. Please try again." };
  }
  expire(slug);
  return { ok: true, message: parsed.data.name + ", your story is with our editors." };
}

export async function createStoryAdmin(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = storyAdminCreateSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid story.");
  const slug = await uniqueSlug(parsed.data.title);
  try {
    await db.insert(stories).values({
      id: randomUUID(),
      ...rowValues(parsed.data, slug),
      userId: null,
      publishedAt: parsed.data.status === "published" ? new Date() : null,
    });
  } catch (error) {
    console.error("[stories] admin create failed:", error);
    return { ok: false, message: "Could not create the story." };
  }
  expire(slug);
  return { ok: true, message: "Story created." };
}

export async function updateStoryAdmin(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = storyAdminUpdateSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid update.");
  const { id, ...patch } = parsed.data;
  const [existing] = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  if (!existing) return { ok: false, message: "Story not found." };

  const candidate = {
    name: existing.name,
    title: existing.title,
    excerpt: existing.excerpt,
    body: existing.body,
    type: existing.type as StoryInput["type"],
    category: existing.category,
    coverUrl: existing.coverUrl ?? "",
    avatarColor: existing.avatarColor,
    duration: existing.duration ?? "",
    audioKey: existing.audioKey,
    attachmentKey: existing.attachmentKey,
    attachmentName: existing.attachmentName,
    status: existing.status as StoryInput["status"],
    featured: existing.featured,
    ...patch,
  };
  const validated = storyAdminCreateSchema.safeParse(candidate);
  if (!validated.success) return fail(validated.error.issues[0], "Invalid story.");
  const slug = patch.title ? await uniqueSlug(validated.data.title, id) : existing.slug;
  await db
    .update(stories)
    .set({
      ...rowValues(validated.data, slug),
      publishedAt:
        validated.data.status === "published"
          ? existing.publishedAt ?? new Date()
          : null,
      updatedAt: new Date(),
    })
    .where(eq(stories.id, id));
  expire(slug);
  return { ok: true, message: "Story updated." };
}

/** Admin accept/reject/publish/unpublish. */
export async function moderateStory(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = storyModerateSchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid update.");
  const [existing] = await db
    .select()
    .from(stories)
    .where(eq(stories.id, parsed.data.id))
    .limit(1);
  if (!existing) return { ok: false, message: "Story not found." };
  await db
    .update(stories)
    .set({
      status: parsed.data.status,
      featured: parsed.data.featured ?? existing.featured,
      publishedAt:
        parsed.data.status === "published" ? existing.publishedAt ?? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(stories.id, existing.id));
  expire(existing.slug);
  return {
    ok: true,
    message:
      parsed.data.status === "published"
        ? "Story published — it is live on the storefront."
        : parsed.data.status === "rejected"
          ? "Story rejected."
          : "Story status updated.",
  };
}

/** Authors may withdraw their own pending/rejected submissions. */
export async function deleteOwnStory(id: string): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in required." };
  if (!idSchema.safeParse({ id }).success) return { ok: false, message: "Invalid story id." };
  const [row] = await db.select().from(stories).where(eq(stories.id, id)).limit(1);
  if (!row) return { ok: false, message: "Story not found." };
  if (row.userId !== session.user.id) {
    return { ok: false, message: "You can only manage your own stories." };
  }
  if (row.status === "published") {
    return { ok: false, message: "Published stories cannot be withdrawn. Contact an editor." };
  }
  await db.delete(stories).where(eq(stories.id, id));
  expire(row.slug);
  return { ok: true, message: "Submission withdrawn." };
}

export async function deleteStoryAdmin(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid story id." };
  const [row] = await db.select().from(stories).where(eq(stories.id, parsed.data.id)).limit(1);
  if (!row) return { ok: false, message: "Story not found." };
  await db.delete(stories).where(eq(stories.id, row.id));
  expire(row.slug);
  return { ok: true, message: "Story deleted." };
}

/** Like/unlike. One row per user per story; the counter is atomic. */
export async function toggleStoryLike(id: string): Promise<SaveResult> {
  const session = await getServerSession();
  if (!session) return { ok: false, message: "Sign in to like stories." };
  if (!idSchema.safeParse({ id }).success) return { ok: false, message: "Invalid story id." };
  const [row] = await db
    .select({ id: stories.id, status: stories.status, slug: stories.slug })
    .from(stories)
    .where(eq(stories.id, id))
    .limit(1);
  if (!row || row.status !== "published") return { ok: false, message: "Story not available." };

  const [existing] = await db
    .select({ storyId: storyLikes.storyId })
    .from(storyLikes)
    .where(and(eq(storyLikes.storyId, id), eq(storyLikes.userId, session.user.id)))
    .limit(1);

  if (existing) {
    await db
      .delete(storyLikes)
      .where(and(eq(storyLikes.storyId, id), eq(storyLikes.userId, session.user.id)));
    await db
      .update(stories)
      .set({ likes: sql`greatest(0, ${stories.likes} - 1)` })
      .where(eq(stories.id, id));
  } else {
    await db
      .insert(storyLikes)
      .values({ storyId: id, userId: session.user.id })
      .onConflictDoNothing();
    await db
      .update(stories)
      .set({ likes: sql`${stories.likes} + 1` })
      .where(eq(stories.id, id));
  }
  expire(row.slug);
  return { ok: true, message: existing ? "Like removed." : "Thanks for the love!" };
}

export async function createCategory(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid category.");
  const slug = slugify(parsed.data.name);
  try {
    await db
      .insert(storyCategories)
      .values({ id: randomUUID(), ...parsed.data, slug })
      .onConflictDoNothing({ target: storyCategories.slug });
  } catch (error) {
    console.error("[stories] category create failed:", error);
    return { ok: false, message: "Could not create the category." };
  }
  expire();
  return { ok: true, message: "Category created." };
}

export async function updateCategory(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = categorySchema.safeParse(input);
  if (!parsed.success) return fail(parsed.error.issues[0], "Invalid category.");
  const id = (input as { id?: string }).id;
  if (!id || id.length > 80) return { ok: false, message: "Invalid category id." };
  await db
    .update(storyCategories)
    .set({ ...parsed.data, slug: slugify(parsed.data.name) })
    .where(eq(storyCategories.id, id));
  expire();
  return { ok: true, message: "Category updated." };
}

export async function deleteCategory(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Admin access required." };
  const parsed = idSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid category id." };
  await db.delete(storyCategories).where(eq(storyCategories.id, parsed.data.id));
  expire();
  return { ok: true, message: "Category deleted." };
}

export type { StoryCopy };
