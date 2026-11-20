"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  CATEGORY_CONTENT_KEY,
  type SaveResult,
} from "@/lib/category-content";
import { categoryContentSchema } from "@/lib/category-schema";

function expireCategories(): void {
  // updateTag (not revalidateTag) because this runs in a Server Action and the
  // admin must see their own save immediately, not stale-while-revalidate.
  updateTag(`content:${CATEGORY_CONTENT_KEY}`);
  updateTag("content");
}

/** Replaces the category document. Requires a real admin session. */
export async function saveCategoryContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }

  const parsed = categoryContentSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the category document did not pass validation.",
    };
  }

  const document = parsed.data;
  try {
    await db
      .insert(contentBlocks)
      .values({ key: CATEGORY_CONTENT_KEY, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[categories] save failed:", error);
    return {
      ok: false,
      message: "Could not save: the database did not accept the change. Try again.",
    };
  }

  expireCategories();
  return {
    ok: true,
    message: `Saved ${document.tiles.length} categor${document.tiles.length === 1 ? "y" : "ies"} — every category page is live for everyone.`,
  };
}

/** Removes the stored document so the built-in sample shelves are used again. */
export async function resetCategoryContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }

  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, CATEGORY_CONTENT_KEY));
  } catch (error) {
    console.error("[categories] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }

  expireCategories();
  return { ok: true, message: "Restored the original sample shelves for everyone." };
}
