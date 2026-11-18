/**
 * One-time seed for the hero section.
 *
 * "Existing data" for the hero lives in two places, and only one of them is
 * reachable from the server:
 *
 *   1. `heroDefaults` in src/lib/hero-content.ts — the 4 sample slides that
 *      every visitor saw before this change. This script writes those to the
 *      database.
 *   2. `localStorage["talknestbd-hero-v1"]` — real edits made in an admin
 *      browser. The server cannot read another machine's localStorage, so those
 *      are imported by the admin UI instead: open /admin/sections/hero, click
 *      "Import into editor", then "Save changes".
 *
 * Safe to re-run: an existing row is never overwritten.
 *
 *   npm run db:seed
 */
import { config } from "dotenv";
import postgres from "postgres";

import { HERO_CONTENT_KEY, heroDefaults } from "../hero-content";

config({ path: [".env.local", ".env"] });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) {
    throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before seeding.");
  }

  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

  try {
    const existing = await sql`
      select key, updated_at from content_blocks where key = ${HERO_CONTENT_KEY}
    `;

    if (existing.length > 0) {
      console.log(
        `content_blocks["${HERO_CONTENT_KEY}"] already exists (updated ${existing[0].updated_at}) — left untouched.`,
      );
      return;
    }

    await sql`
      insert into content_blocks (key, data)
      values (${HERO_CONTENT_KEY}, ${sql.json({ banners: heroDefaults.banners })})
    `;

    console.log(
      `Seeded content_blocks["${HERO_CONTENT_KEY}"] with ${heroDefaults.banners.length} sample slides.`,
    );
  } finally {
    await sql.end({ timeout: 5 });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});