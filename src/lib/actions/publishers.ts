"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  PUBLISHER_CONTENT_KEY,
  type SaveResult,
} from "@/lib/publisher-content";
import { publisherContentSchema } from "@/lib/publisher-schema";

function expire(): void {
  updateTag(`content:${PUBLISHER_CONTENT_KEY}`);
  updateTag("content");
}

export async function savePublisherContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }
  const parsed = publisherContentSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the publishers did not pass validation.",
    };
  }
  const document = parsed.data;
  try {
    await db
      .insert(contentBlocks)
      .values({ key: PUBLISHER_CONTENT_KEY, data: document })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: document, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[publishers] save failed:", error);
    return { ok: false, message: "Could not save: the database did not accept the change." };
  }
  expire();
  return {
    ok: true,
    message: `Saved ${document.publishers.length} publisher${document.publishers.length === 1 ? "" : "s"} — the strip and publisher pages are live for everyone.`,
  };
}

export async function resetPublisherContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }
  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, PUBLISHER_CONTENT_KEY));
  } catch (error) {
    console.error("[publishers] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }
  expire();
  return { ok: true, message: "Restored the original publishers for everyone." };
}
