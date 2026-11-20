"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  VIRAL_SHELF_KEY,
  type SaveResult,
} from "@/lib/shelf-content";
import { viralShelfSchema } from "@/lib/shelf-schema";

function expireViralShelf(): void {
  updateTag(`content:${VIRAL_SHELF_KEY}`);
  updateTag("content");
}

/** Publishes the viral shelf (heading + books). Requires a real admin session. */
export async function saveViralShelfContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }

  const parsed = viralShelfSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the shelf did not pass validation.",
    };
  }

  const document = parsed.data;
  try {
    await db
      .insert(contentBlocks)
      .values({ key: VIRAL_SHELF_KEY, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[viral-books] save failed:", error);
    return { ok: false, message: "Could not save: the database did not accept the change." };
  }

  expireViralShelf();
  return {
    ok: true,
    message: `Saved ${document.books.length} viral book${document.books.length === 1 ? "" : "s"} — the storefront shelves are live for everyone.`,
  };
}

/** Removes the stored document so the built-in sample shelf is used again. */
export async function resetViralShelfContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the shelf." };
  }

  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, VIRAL_SHELF_KEY));
  } catch (error) {
    console.error("[viral-books] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }

  expireViralShelf();
  return { ok: true, message: "Restored the original viral books for everyone." };
}
