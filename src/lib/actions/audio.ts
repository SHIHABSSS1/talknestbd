"use server";

import { randomUUID } from "node:crypto";

import { revalidateTag } from "next/cache";
import { eq } from "drizzle-orm";

import type { BookCoverTheme } from "@/lib/types";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { audioChapters, audiobooks, contentBlocks } from "@/lib/db/schema";
import {
  cloneAudioDefaults,
  type SaveResult,
} from "@/lib/audio-content";
import {
  audioCopySchema,
  createAudiobookSchema,
  deleteAudiobookSchema,
  updateAudiobookSchema,
} from "@/lib/audio-schema";

function expire(): void {
  // These actions are invoked both as Server Actions and from Route Handlers;
  // revalidateTag works in both, while updateTag is Server-Action-only.
  revalidateTag("content:audio", "max");
  revalidateTag("audio", "max");
  revalidateTag("content", "max");
}

async function guard(): Promise<boolean> {
  return isAdminSession(await getServerSession());
}

export async function saveAudioCopy(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to save changes." };
  const parsed = audioCopySchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue ? `Could not save: ${issue.path.join(".")} — ${issue.message}` : "Invalid copy.",
    };
  }
  try {
    await db
      .insert(contentBlocks)
      .values({ key: "audio", data: parsed.data })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: parsed.data, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[audio] copy save failed:", error);
    return { ok: false, message: "Could not save: database error." };
  }
  expire();
  return { ok: true, message: "Saved — the audiobook pages are live for everyone." };
}

export async function resetAudioCopy(): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to reset." };
  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, "audio"));
  } catch (error) {
    console.error("[audio] copy reset failed:", error);
    return { ok: false, message: "Could not reset: database error." };
  }
  expire();
  return { ok: true, message: "Restored the original audiobook copy." };
}

type Input = Record<string, unknown>;

function toRowValues(input: Input) {
  return {
    slug: String(input.slug),
    title: String(input.title),
    subtitle: (input.subtitle as string) || null,
    author: String(input.author),
    authorSlug: String(input.authorSlug ?? ""),
    publisher: String(input.publisher ?? "TalkNest Audio"),
    publisherSlug: String(input.publisherSlug ?? "talknestaudio"),
    narrator: String(input.narrator),
    source: String(input.source ?? ""),
    duration: String(input.duration),
    description: String(input.description ?? ""),
    longDescription: (input.longDescription as string[]) ?? [],
    highlights: (input.highlights as string[]) ?? [],
    category: String(input.category ?? "uponnash"),
    subcategory: (input.subcategory as string) || null,
    price: Number(input.price).toFixed(2),
    oldPrice: input.oldPrice ? Number(input.oldPrice).toFixed(2) : null,
    free: Boolean(input.free),
    status: String(input.status ?? "published"),
    featured: Boolean(input.featured),
    cover: input.cover as BookCoverTheme,
    rating: Number(input.rating ?? 4.8).toFixed(1),
    reviewCount: Number(input.reviewCount ?? 0),
    pages: Number(input.pages ?? 0),
    language: String(input.language ?? "Bangla"),
    binding: String(input.binding ?? "Audiobook"),
    publishedYear: Number(input.publishedYear ?? 2026),
    stock: Number(input.stock ?? 999),
    isbn: (input.isbn as string) || null,
  };
}

async function writeChapters(id: string, chapters: Input["chapters"]) {
  await db.delete(audioChapters).where(eq(audioChapters.audiobookId, id));
  if (!Array.isArray(chapters) || !chapters.length) return;
  await db.insert(audioChapters).values(
    chapters.map((chapter, position) => {
      const item = chapter as Record<string, unknown>;
      return {
        id: String(item.id || randomUUID()),
        audiobookId: id,
        position,
        title: String(item.title),
        duration: String(item.duration ?? "—"),
        src: String(item.src),
        free: Boolean(item.free),
      };
    }),
  );
}

export async function createAudiobook(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to add an audiobook." };
  const parsed = createAudiobookSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue ? `Could not save: ${issue.path.join(".")} — ${issue.message}` : "Invalid audiobook.",
    };
  }
  const id = randomUUID();
  try {
    await db.insert(audiobooks).values({ id, ...toRowValues(parsed.data as Input) });
    await writeChapters(id, parsed.data.chapters as unknown as Input["chapters"]);
  } catch (error) {
    console.error("[audio] create failed:", error);
    return { ok: false, message: "Could not create the audiobook: a slug may already exist." };
  }
  expire();
  return { ok: true, message: "Audiobook published." };
}

export async function updateAudiobook(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to edit." };
  const withSlug = input as Input;
  const parsed = updateAudiobookSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue ? `Could not save: ${issue.path.join(".")} — ${issue.message}` : "Invalid update.",
    };
  }
  const { id, ...patch } = parsed.data;
  try {
    const [existing] = await db
      .select({ slug: audiobooks.slug })
      .from(audiobooks)
      .where(eq(audiobooks.id, id))
      .limit(1);
    if (!existing) return { ok: false, message: "Audiobook not found." };
    const values = toRowValues({
      ...patch,
      slug: String(withSlug.slug ?? existing.slug),
    });
    await db
      .update(audiobooks)
      .set({ ...values, updatedAt: new Date() })
      .where(eq(audiobooks.id, id));
    if (patch.chapters) {
      await writeChapters(id, patch.chapters as unknown as Input["chapters"]);
    }
  } catch (error) {
    console.error("[audio] update failed:", error);
    return { ok: false, message: "Could not update the audiobook." };
  }
  expire();
  return { ok: true, message: "Audiobook updated." };
}

export async function deleteAudiobook(input: unknown): Promise<SaveResult> {
  if (!(await guard())) return { ok: false, message: "Sign in as an admin to delete." };
  const parsed = deleteAudiobookSchema.safeParse(input);
  if (!parsed.success) return { ok: false, message: "Invalid audiobook id." };
  await db.delete(audiobooks).where(eq(audiobooks.id, parsed.data.id));
  expire();
  return { ok: true, message: "Audiobook deleted." };
}

export { cloneAudioDefaults };
