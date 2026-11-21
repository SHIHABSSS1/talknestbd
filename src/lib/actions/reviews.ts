"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  REVIEW_CONTENT_KEY,
  type SaveResult,
} from "@/lib/review-content";
import { reviewCopySchema } from "@/lib/review-schema";

function expire(): void {
  updateTag(`content:${REVIEW_CONTENT_KEY}`);
  updateTag("content");
}

export async function saveReviewContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = reviewCopySchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the content did not pass validation.",
    };
  }
  const document = parsed.data;
  try {
    await db
      .insert(contentBlocks)
      .values({ key: REVIEW_CONTENT_KEY, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[reviews] copy save failed:", error);
    return { ok: false, message: "Could not save: the database did not accept the change." };
  }
  expire();
  return { ok: true, message: "Saved — the review sections are live for everyone." };
}

export async function resetReviewContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }
  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, REVIEW_CONTENT_KEY));
  } catch (error) {
    console.error("[reviews] copy reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }
  expire();
  return { ok: true, message: "Restored the original review copy for everyone." };
}
