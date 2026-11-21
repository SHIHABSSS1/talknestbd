"use server";

import { randomUUID } from "node:crypto";

import { updateTag } from "next/cache";
import { eq, inArray } from "drizzle-orm";
import { z } from "zod";

import { getServerSession, isAdminSession } from "@/lib/auth-guards";
import { db } from "@/lib/db";
import { contentBlocks, dataSnapshots } from "@/lib/db/schema";
import { listSnapshots } from "@/lib/db/queries/snapshots";
import {
  CATEGORY_CONTENT_KEY,
  categoryDefaults,
} from "@/lib/category-content";
import { categoryContentSchema } from "@/lib/category-schema";
import {
  HERO_CONTENT_KEY,
  heroDefaults,
} from "@/lib/hero-content";
import { heroContentSchema } from "@/lib/hero-schema";
import {
  TRUST_CONTENT_KEY,
  trustDefaults,
} from "@/lib/trust-content";
import { trustContentSchema } from "@/lib/trust-schema";
import {
  INTERNATIONAL_SHELF_KEY,
  NEW_ARRIVALS_SHELF_KEY,
  STUDENT_SHELF_KEY,
  SUNNAH_SHELF_KEY,
  TRENDING_SHELF_KEY,
  UP_SALE_SHELF_KEY,
  VIRAL_SHELF_KEY,
  cloneInternationalShelfDefaults,
  cloneNewArrivalsShelfDefaults,
  cloneStudentShelfDefaults,
  cloneSunnahShelfDefaults,
  cloneTrendingShelfDefaults,
  cloneUpSaleShelfDefaults,
  cloneViralShelfDefaults,
} from "@/lib/shelf-content";
import {
  AUTHOR_CONTENT_KEY,
  authorDefaults,
} from "@/lib/author-content";
import {
  PUBLISHER_CONTENT_KEY,
  publisherDefaults,
} from "@/lib/publisher-content";
import { viralShelfSchema } from "@/lib/shelf-schema";
import { SELL_CONTENT_KEY, sellDefaults } from "@/lib/sell-content";
import { sellContentSchema } from "@/lib/sell-schema";
import { USED_CONTENT_KEY, usedDefaults } from "@/lib/used-content";
import { usedContentSchema } from "@/lib/used-schema";
import {
  WHOLESALE_CONTENT_KEY,
  wholesaleDefaults,
} from "@/lib/wholesale-content";
import { wholesaleContentSchema } from "@/lib/wholesale-schema";
import { REVIEW_CONTENT_KEY, reviewDefaults } from "@/lib/review-content";
import { reviewCopySchema } from "@/lib/review-schema";
import { audioCopySchema } from "@/lib/audio-schema";
import { cloneAudioDefaults } from "@/lib/audio-content";
import { authorContentSchema } from "@/lib/author-schema";
import { publisherContentSchema } from "@/lib/publisher-schema";
import {
  SNAPSHOT_KEYS,
  type SnapshotResult,
} from "@/lib/snapshots";

const createInputSchema = z.object({
  label: z.string().trim().min(1).max(80).optional(),
  note: z.string().trim().max(300).optional(),
});

const restoreInputSchema = z.string().trim().min(1).max(80);

/** The three editable documents, with the shipped demo defaults as fallback. */
const defaults: Record<string, unknown> = {
  [HERO_CONTENT_KEY]: { banners: heroDefaults.banners },
  [TRUST_CONTENT_KEY]: { cards: trustDefaults.cards },
  [CATEGORY_CONTENT_KEY]: categoryDefaults,
  [VIRAL_SHELF_KEY]: cloneViralShelfDefaults(),
  [UP_SALE_SHELF_KEY]: cloneUpSaleShelfDefaults(),
  [NEW_ARRIVALS_SHELF_KEY]: cloneNewArrivalsShelfDefaults(),
  [TRENDING_SHELF_KEY]: cloneTrendingShelfDefaults(),
  [SUNNAH_SHELF_KEY]: cloneSunnahShelfDefaults(),
  [INTERNATIONAL_SHELF_KEY]: cloneInternationalShelfDefaults(),
  [STUDENT_SHELF_KEY]: cloneStudentShelfDefaults(),
  [SELL_CONTENT_KEY]: sellDefaults,
  [USED_CONTENT_KEY]: usedDefaults,
  [WHOLESALE_CONTENT_KEY]: wholesaleDefaults,
  [REVIEW_CONTENT_KEY]: reviewDefaults,
  audio: cloneAudioDefaults(),
  [AUTHOR_CONTENT_KEY]: authorDefaults,
  [PUBLISHER_CONTENT_KEY]: publisherDefaults,
};

const validators: Record<string, { safeParse: (value: unknown) => { success: boolean } }> = {
  [HERO_CONTENT_KEY]: heroContentSchema,
  [TRUST_CONTENT_KEY]: trustContentSchema,
  [CATEGORY_CONTENT_KEY]: categoryContentSchema,
  [VIRAL_SHELF_KEY]: viralShelfSchema,
  [UP_SALE_SHELF_KEY]: viralShelfSchema,
  [NEW_ARRIVALS_SHELF_KEY]: viralShelfSchema,
  [TRENDING_SHELF_KEY]: viralShelfSchema,
  [SUNNAH_SHELF_KEY]: viralShelfSchema,
  [INTERNATIONAL_SHELF_KEY]: viralShelfSchema,
  [STUDENT_SHELF_KEY]: viralShelfSchema,
  [SELL_CONTENT_KEY]: sellContentSchema,
  [USED_CONTENT_KEY]: usedContentSchema,
  [WHOLESALE_CONTENT_KEY]: wholesaleContentSchema,
  [REVIEW_CONTENT_KEY]: reviewCopySchema,
  audio: audioCopySchema,
  [AUTHOR_CONTENT_KEY]: authorContentSchema,
  [PUBLISHER_CONTENT_KEY]: publisherContentSchema,
};

function expireAllContent(): void {
  for (const key of SNAPSHOT_KEYS) updateTag(`content:${key}`);
  updateTag("content");
}

/** Captures the current content blocks into a new, admin-owned snapshot row. */
export async function createSnapshot(input?: unknown): Promise<SnapshotResult> {
  const session = await getServerSession();
  if (!session || !isAdminSession(session)) {
    return { ok: false, message: "Sign in as an admin to manage snapshots." };
  }

  const parsed = createInputSchema.safeParse(input ?? {});
  if (!parsed.success) {
    return { ok: false, message: "Could not save: the snapshot details are invalid." };
  }

  try {
    const rows = await db
      .select({ key: contentBlocks.key, data: contentBlocks.data })
      .from(contentBlocks)
      .where(inArray(contentBlocks.key, [...SNAPSHOT_KEYS]));

    const data: Record<string, unknown> = { ...defaults };
    for (const row of rows) data[row.key] = row.data;

    await db.insert(dataSnapshots).values({
      id: randomUUID(),
      label: parsed.data.label || `Manual snapshot`,
      kind: "manual",
      data,
      note: parsed.data.note || null,
      createdBy: session.user.id,
    });
  } catch (error) {
    console.error("[snapshots] create failed:", error);
    return { ok: false, message: "Could not create the snapshot. Try again." };
  }

  return {
    ok: true,
    message: "Snapshot saved to the database. You can restore it from this list at any time.",
    snapshots: await listSnapshots(),
  };
}

/**
 * Restores a snapshot into the content blocks. Every document is validated
 * before any write, so a corrupt or hand-edited snapshot cannot publish junk.
 */
export async function restoreSnapshot(input: unknown): Promise<SnapshotResult> {
  if (!isAdminSession(await getServerSession())) {
    return { ok: false, message: "Sign in as an admin to manage snapshots." };
  }

  const id = restoreInputSchema.safeParse(input);
  if (!id.success) {
    return { ok: false, message: "That snapshot could not be found." };
  }

  try {
    const [row] = await db
      .select({ data: dataSnapshots.data })
      .from(dataSnapshots)
      .where(eq(dataSnapshots.id, id.data))
      .limit(1);

    if (!row) {
      return { ok: false, message: "That snapshot no longer exists." };
    }

    const document = row.data;
    if (!document || typeof document !== "object" || Array.isArray(document)) {
      return { ok: false, message: "That snapshot is empty and cannot be restored." };
    }

    const records = document as Record<string, unknown>;
    const documents: { key: string; data: unknown }[] = [];
    for (const key of SNAPSHOT_KEYS) {
      const value = records[key] ?? defaults[key];
      const result = validators[key].safeParse(value);
      if (!result.success) {
        return {
          ok: false,
          message: `That snapshot has an invalid ${key} document and was not restored.`,
        };
      }
      documents.push({ key, data: value });
    }

    for (const item of documents) {
      await db
        .insert(contentBlocks)
        .values({ key: item.key, data: item.data as never })
        .onConflictDoUpdate({
          target: contentBlocks.key,
          set: { data: item.data as never, updatedAt: new Date() },
        });
    }
  } catch (error) {
    console.error("[snapshots] restore failed:", error);
    return { ok: false, message: "Could not restore the snapshot. Try again." };
  }

  expireAllContent();
  return {
    ok: true,
    message: "Snapshot restored — all three homepage content sections are live again.",
    snapshots: await listSnapshots(),
  };
}
