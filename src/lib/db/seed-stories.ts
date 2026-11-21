/**
 * Seed the API-driven Reader Story Community from the existing demo stories.
 * Safe to re-run: existing rows are never overwritten and no fake likes or
 * submissions are created.
 *
 *   npm run db:seed:stories
 */
import { config } from "dotenv";
import postgres from "postgres";

import { stories as demoStories } from "../../data/community";
import { slugify } from "../slug";
import { STORIES_CONTENT_KEY, storyDefaults } from "../story-content";

config({ path: [".env.local", ".env"] });

async function main() {
  const url = process.env.DATABASE_URL_UNPOOLED ?? process.env.DATABASE_URL;
  if (!url) throw new Error("Set DATABASE_URL_UNPOOLED or DATABASE_URL before seeding.");
  const sql = postgres(url, { max: 1, prepare: false, onnotice: () => {} });

  try {
    await sql`
      insert into content_blocks (key, data)
      values (${STORIES_CONTENT_KEY}, ${sql.json(storyDefaults)})
      on conflict (key) do nothing
    `;

    for (const category of ["Community", "Memory", "Faith", "Family"]) {
      await sql`
        insert into story_categories (id, name, slug, description)
        values (${`cat-${slugify(category)}`}, ${category}, ${slugify(category)}, ${""})
        on conflict (id) do nothing
      `;
    }

    const existing = await sql<{ count: number }[]>`select count(*)::int as count from stories`;
    if (existing[0]?.count === 0) {
      for (const [index, story] of demoStories.entries()) {
        await sql`
          insert into stories (
            id, slug, name, title, excerpt, body, type, category, avatar_color,
            duration, likes, status, published_at
          ) values (
            ${story.id}, ${slugify(story.title)}, ${story.name}, ${story.title},
            ${story.excerpt},
            ${`${story.excerpt}\n\nThis story comes from a TalkNest reader. Stories published on TalkNest come from readers' own experiences — a mix of true events and imagination.`},
            ${story.type}, 'Community', ${story.avatarColor},
            ${story.duration ?? null}, ${story.likes}, 'published',
            now() - (${index * 3 + 2} || ' days')::interval
          ) on conflict (id) do nothing
        `;
      }
      console.log(`Seeded ${demoStories.length} stories.`);
    } else {
      console.log("Stories already present — left untouched.");
    }
  } finally {
    await sql.end();
  }
}

main().catch((error) => { console.error(error); process.exit(1); });
