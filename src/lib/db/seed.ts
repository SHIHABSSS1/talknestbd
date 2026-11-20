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
