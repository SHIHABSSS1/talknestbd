"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  USED_CONTENT_KEY,
  type SaveResult,
} from "@/lib/used-content";
import { usedContentSchema } from "@/lib/used-schema";

function expire(): void {
  updateTag(`content:${USED_CONTENT_KEY}`);
  updateTag("content");
}

export async function saveUsedContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = usedContentSchema.safeParse(input);
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
      .values({ key: USED_CONTENT_KEY, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[used] save failed:", error);
    return { ok: false, message: "Could not save: the database did not accept the change." };
  }
  expire();
  return { ok: true, message: "Saved — the pre-loved books banner is live for everyone." };
}

export async function resetUsedContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }
  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, USED_CONTENT_KEY));
  } catch (error) {
    console.error("[used] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }
  expire();
  return { ok: true, message: "Restored the original pre-loved books banner for everyone." };
}
