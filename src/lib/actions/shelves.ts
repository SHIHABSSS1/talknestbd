"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  NEW_ARRIVALS_SHELF_KEY,
  TRENDING_SHELF_KEY,
  UP_SALE_SHELF_KEY,
  VIRAL_SHELF_KEY,
  type SaveResult,
} from "@/lib/shelf-content";
import { viralShelfSchema, type ViralShelfInput } from "@/lib/shelf-schema";

function expireShelf(key: string): void {
  updateTag(`content:${key}`);
  updateTag("content");
}

async function writeShelf(
  key: string,
  document: ViralShelfInput,
  label: string,
): Promise<SaveResult> {
  try {
    await db
      .insert(contentBlocks)
      .values({ key, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error(`[${label}] save failed:`, error);
    return { ok: false, message: "Could not save: the database did not accept the change." };
  }
  expireShelf(key);
  return {
    ok: true,
    message: `Saved ${document.books.length} book${document.books.length === 1 ? "" : "s"} — the storefront shelves are live for everyone.`,
  };
}

async function deleteShelf(key: string, label: string): Promise<SaveResult> {
  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, key));
  } catch (error) {
    console.error(`[${label}] reset failed:`, error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }
  expireShelf(key);
  return { ok: true, message: "Restored the original shelf for everyone." };
}

function parseShelf(input: unknown) {
  const parsed = viralShelfSchema.safeParse(input);
  if (parsed.success) return { data: parsed.data, error: null as string | null };
  const issue = parsed.error.issues[0];
  return {
    data: null,
    error: issue
      ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
      : "Could not save: the shelf did not pass validation.",
  };
}

/** Publishes the viral shelf (heading + books). Requires a real admin session. */
export async function saveViralShelfContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = parseShelf(input);
  if (!parsed.data) return { ok: false, message: parsed.error! };
  return writeShelf(VIRAL_SHELF_KEY, parsed.data, "viral-books");
}

/** Removes the stored viral document so the built-in shelf is used again. */
export async function resetViralShelfContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the shelf." };
  }
  return deleteShelf(VIRAL_SHELF_KEY, "viral-books");
}

/** Publishes the 50% Up Sale shelf (heading + books). */
export async function saveUpSaleShelfContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = parseShelf(input);
  if (!parsed.data) return { ok: false, message: parsed.error! };
  return writeShelf(UP_SALE_SHELF_KEY, parsed.data, "up-sale");
}

/** Removes the stored up-sale document so the built-in shelf is used again. */
export async function resetUpSaleShelfContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the shelf." };
  }
  return deleteShelf(UP_SALE_SHELF_KEY, "up-sale");
}

/** Publishes the New Arrivals shelf (heading + books). */
export async function saveNewArrivalsShelfContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = parseShelf(input);
  if (!parsed.data) return { ok: false, message: parsed.error! };
  return writeShelf(NEW_ARRIVALS_SHELF_KEY, parsed.data, "new-arrivals");
}

/** Removes the stored new-arrivals document so the built-in shelf is used again. */
export async function resetNewArrivalsShelfContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the shelf." };
  }
  return deleteShelf(NEW_ARRIVALS_SHELF_KEY, "new-arrivals");
}

/** Publishes the Trending Now shelf (heading + books). */
export async function saveTrendingShelfContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = parseShelf(input);
  if (!parsed.data) return { ok: false, message: parsed.error! };
  return writeShelf(TRENDING_SHELF_KEY, parsed.data, "trending");
}

/** Removes the stored trending document so the built-in shelf is used again. */
export async function resetTrendingShelfContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the shelf." };
  }
  return deleteShelf(TRENDING_SHELF_KEY, "trending");
}
