/**
 * One-time seed for the editable homepage content and its demo snapshot.
 *
 * "Existing data" for these sections lives in two places, and only one of them
 * is reachable from the server:
 *
 *   1. The built-in defaults in src/lib/*-content.ts — the documents every
 *      visitor saw before these sections moved to the database. This script
 *      writes those defaults to the database.
 *   2. localStorage keys written by real admin edits. The server cannot read
 *      another machine's localStorage, so each editor offers a one-click
 *      "Import from this browser" action instead.
 *
 * A `demo` snapshot is also seeded: it freezes the shipped demo documents so
 * they can always be restored from /admin/settings (Data tab), even after an
 * admin has overwritten the live blocks.
 *
 * Safe to re-run: existing rows are never overwritten.
 *
 *   npm run db:seed
 */
import { config } from "dotenv";
import postgres from "postgres";

import {
  CATEGORY_CONTENT_KEY,
  categoryDefaults,
} from "../category-content";
import {
  HERO_CONTENT_KEY,
  heroDefaults,
} from "../hero-content";
import {
  TRUST_CONTENT_KEY,
  trustDefaults,
} from "../trust-content";
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
} from "../shelf-content";
import {
  AUTHOR_CONTENT_KEY,
  authorDefaults,
} from "../author-content";
import {
  PUBLISHER_CONTENT_KEY,
  publisherDefaults,
} from "../publisher-content";
import {
  SELL_CONTENT_KEY,
  sellDefaults,
} from "../sell-content";
import {
  USED_CONTENT_KEY,
  usedDefaults,
} from "../used-content";
import {
  WHOLESALE_CONTENT_KEY,
  wholesaleDefaults,
} from "../wholesale-content";
import {
  REVIEW_CONTENT_KEY,
  reviewDefaults,
} from "../review-content";
import { reviews as demoReviews } from "../../data/reviews";
import { audioDefaults } from "../audio-content";
import { VIDEO_QUIZ_CONTENT_KEY, videoQuizDefaults } from "../video-quiz-content";
import { STORIES_CONTENT_KEY, storyDefaults } from "../story-content";

config({ path: [".env.local", ".env"] });

const DEMO_SNAPSHOT_ID = "snapshot-demo-v1";

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before seeding.");
  }

  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

  const demoDocuments: Record<string, unknown> = {
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
    [AUTHOR_CONTENT_KEY]: authorDefaults,
    [PUBLISHER_CONTENT_KEY]: publisherDefaults,
    [SELL_CONTENT_KEY]: sellDefaults,
    [USED_CONTENT_KEY]: usedDefaults,
    [WHOLESALE_CONTENT_KEY]: wholesaleDefaults,
    [REVIEW_CONTENT_KEY]: reviewDefaults,
    audio: audioDefaults,
    [VIDEO_QUIZ_CONTENT_KEY]: videoQuizDefaults,
    [STORIES_CONTENT_KEY]: storyDefaults,
  };

  try {
    const existing = await sql<{ key: string }[]>`
      select key from content_blocks where key = any(${Object.keys(demoDocuments)})
    `;
    const present = new Set(existing.map((row) => row.key));

    for (const [key, document] of Object.entries(demoDocuments)) {
      if (present.has(key)) {
        console.log(`content_blocks["${key}"] already exists — left untouched.`);
        continue;
      }
      await sql`
        insert into content_blocks (key, data)
        values (${key}, ${sql.json(document as never)})
      `;
      console.log(`Seeded content_blocks["${key}"] with the built-in demo document.`);
    }

    const reviewCount = await sql<{ n: number }[]>`
      select count(*)::int as n from reviews
    `;
    if (reviewCount[0]?.n === 0) {
      for (const review of demoReviews) {
        await sql`
          insert into reviews (
            id, source, status, pinned, rating, title, text,
            book_slug, book_title, book_kind, name, location,
            avatar_color, verified, created_at
          ) values (
            ${review.id}, ${review.source}, ${review.status}, ${review.pinned},
            ${review.rating}, ${review.title}, ${review.text},
            ${review.bookSlug}, ${review.bookTitle}, ${review.kind},
            ${review.name}, ${review.location}, ${review.avatarColor},
            ${review.verified}, ${review.createdAt}
          )
        `;
      }
      console.log(`Seeded ${demoReviews.length} demo reviews.`);
    } else {
      console.log("Reviews already present — left untouched.");
    }

    const audioCount = await sql<{ n: number }[]>`
      select count(*)::int as n from audiobooks
    `;
    if (audioCount[0]?.n === 0) {
      const freeSlugs = new Set(["neel-megh", "moner-gohine"]);
      for (const [index, entry] of audioDefaults.books.entries()) {
        const id = `seed-audio-${entry.slug}`;
        const price = entry.free ? 0 : entry.price;
        await sql`
          insert into audiobooks (
            id, slug, title, author, author_slug, publisher, publisher_slug,
            narrator, source, duration, description, long_description, highlights,
            category, price, free, status, featured, cover, rating, review_count,
            pages, language, binding, published_year, stock
          ) values (
            ${id}, ${entry.slug}, ${entry.title}, ${entry.author},
            ${entry.author.toLowerCase().replace(/[^a-z0-9]+/g, "-")},
            ${"TalkNest Audio"}, ${"talknestaudio"}, ${entry.narrator},
            ${"Original TalkNest narration"}, ${entry.duration}, ${entry.description},
            ${sql.json([entry.description])},
            ${sql.json([] as string[])},
            ${"uponnash"}, ${price.toFixed(2)}, ${freeSlugs.has(entry.slug)},
            ${"published"}, ${index === 0}, ${sql.json(entry.cover as never)},
            ${"4.8"}, ${0}, ${0}, ${"Bangla"}, ${"Audiobook"}, ${2026}, ${999}
          )
        `;
        for (const [position, chapter] of entry.chapters.entries()) {
          await sql`
            insert into audio_chapters (id, audiobook_id, position, title, duration, src, free)
            values (
              ${`seed-ch-${entry.slug}-${position}`}, ${id}, ${position},
              ${chapter.title}, ${chapter.duration}, ${chapter.src},
              ${freeSlugs.has(entry.slug) || chapter.free}
            )
          `;
        }
      }
      console.log(`Seeded ${audioDefaults.books.length} audiobooks with chapters.`);
    } else {
      console.log("Audiobooks already present — left untouched.");
    }

    const snapshot = await sql`
      select id from data_snapshots where id = ${DEMO_SNAPSHOT_ID}
    `;
    if (snapshot.length > 0) {
      console.log(`Snapshot "${DEMO_SNAPSHOT_ID}" already exists — left untouched.`);
    } else {
      await sql`
        insert into data_snapshots (id, label, kind, data, note)
        values (
          ${DEMO_SNAPSHOT_ID},
          ${"Demo data (initial)"},
          ${"demo"},
          ${sql.json(demoDocuments)},
          ${"Frozen copy of the shipped demo content, seeded on first migration."}
        )
      `;
      console.log(`Seeded demo snapshot "${DEMO_SNAPSHOT_ID}".`);
    }
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
