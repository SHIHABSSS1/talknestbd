"use server";

import { updateTag } from "next/cache";
import { eq } from "drizzle-orm";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks } from "@/lib/db/schema";
import {
  HERO_CONTENT_KEY,
  type SaveResult,
} from "@/lib/hero-content";
import { heroContentSchema } from "@/lib/hero-schema";

function expireHero(): void {
  // updateTag (not revalidateTag) because this runs in a Server Action and the
  // admin must see their own save immediately, not stale-while-revalidate.
  updateTag(`content:${HERO_CONTENT_KEY}`);
  updateTag("content");
}

/** Replaces the hero document. Requires a real admin session. */
export async function saveHeroContent(input: unknown): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to save changes." };
  }

  const parsed = heroContentSchema.safeParse(input);

  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      ok: false,
      message: issue
        ? `Could not save: ${issue.path.join(".") || "content"} — ${issue.message}`
        : "Could not save: the slides did not pass validation.",
    };
  }

  // An empty list is a legitimate choice: the storefront then shows its
  // "no banner slides configured" state. Only Reset restores the sample slides.
  const banners = parsed.data.banners;

  try {
    await db
      .insert(contentBlocks)
      .values({ key: HERO_CONTENT_KEY, data: { banners } })
      .onConflictDoUpdate({
        target: contentBlocks.key,
        set: { data: { banners }, updatedAt: new Date() },
      });
  } catch (error) {
    console.error("[hero] save failed:", error);
    return {
      ok: false,
      message: "Could not save: the database did not accept the change. Try again.",
    };
  }

  expireHero();

  return {
    ok: true,
    message: `Saved ${banners.length} slide${banners.length === 1 ? "" : "s"} — the homepage hero is live for everyone.`,
  };
}

/** Removes the stored document so the built-in sample slides are used again. */
export async function resetHeroContent(): Promise<SaveResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to reset the section." };
  }

  try {
    await db.delete(contentBlocks).where(eq(contentBlocks.key, HERO_CONTENT_KEY));
  } catch (error) {
    console.error("[hero] reset failed:", error);
    return { ok: false, message: "Could not reset: the database request failed." };
  }

  expireHero();

  return { ok: true, message: "Restored the original sample slides for everyone." };
}