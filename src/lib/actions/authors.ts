"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  AUTHOR_CONTENT_KEY,
  type SaveResult,
} from "@/lib/author-content";
import { authorContentSchema } from "@/lib/author-schema";

function expire(): void {
  updateTag(`content:${AUTHOR_CONTENT_KEY}`);
  updateTag("content");
}

export async function saveAuthorContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = authorContentSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the authors did not pass validation.",
    };
  }
  const document = parsed.data;
  try {
    await db
      .insert(contentBlocks)
      .values({ key: AUTHOR_CONTENT_KEY, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[authors] save failed:", error);
    return { ok: false, message: "Could not save: the database did not accept the change." };
  }
  expire();
  return {
    ok: true,
    message: `Saved ${document.authors.length} author${document.authors.length === 1 ? "" : "s"} — the spotlight and author pages are live for everyone.`,
  };
}

export async function resetAuthorContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }
  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, AUTHOR_CONTENT_KEY));
  } catch (error) {
    console.error("[authors] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }
  expire();
  return { ok: true, message: "Restored the original authors for everyone." };
}
