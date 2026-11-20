"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  TRUST_CONTENT_KEY,
  type SaveResult,
} from "@/lib/trust-content";
import { trustContentSchema } from "@/lib/trust-schema";

function expireTrust(): void {
  // updateTag (not revalidateTag) because this runs in a Server Action and the
  // admin must see their own save immediately, not stale-while-revalidate.
  updateTag(`content:${TRUST_CONTENT_KEY}`);
  updateTag("content");
}

/** Replaces the trust-strip document. Requires a real admin session. */
export async function saveTrustContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }

  const parsed = trustContentSchema.safeParse(input);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the cards did not pass validation.",
    };
  }

  const cards = parsed.data.cards;
  try {
    await db
      .insert(contentBlocks)
      .values({ key: TRUST_CONTENT_KEY, data: { cards } })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: { cards }, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[trust-strip] save failed:", error);
    return {
      ok: false,
      message: "Could not save: the database did not accept the change. Try again.",
    };
  }

  expireTrust();
  return {
    ok: true,
    message: `Saved ${cards.length} card${cards.length === 1 ? "" : "s"} — the homepage trust strip is live for everyone.`,
  };
}

/** Removes the stored document so the built-in sample cards are used again. */
export async function resetTrustContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }

  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, TRUST_CONTENT_KEY));
  } catch (error) {
    console.error("[trust-strip] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }

  expireTrust();
  return { ok: true, message: "Restored the original sample cards for everyone." };
}
