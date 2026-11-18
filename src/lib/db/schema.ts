import { jsonb, pgTable, text, timestamp } from "drizzle-orm/pg-core";

/**
 * Editable page content — one row per block, keyed by a stable string.
 *
 * Why JSONB instead of one table per section: the admin panel edits ~20
 * section documents (hero, trust strip, category cards, shelf headings, site
 * settings...). Each has a different shape and changes shape as the UI evolves.
 * A single `key` + `data` table keeps that flexible without a migration per
 * field, while the relational catalogue/orders stay properly normalised.
 *
 * Validation lives in `src/lib/*-schema.ts` (zod), never in the database: the
 * DB stores the document, the server action decides if it is legal.
 */
export const contentBlocks = pgTable("content_blocks", {
  /** Stable block id, e.g. "hero", "trust-strip", "site-settings". */
  key: text("key").primaryKey(),
  /** The block document. Shape is enforced server-side before writing. */
  data: jsonb("data").notNull(),
  updatedAt: timestamp("updated_at", { withTimezone: true })
    .notNull()
    .defaultNow(),
});

export type ContentBlock = typeof contentBlocks.$inferSelect;
export type NewContentBlock = typeof contentBlocks.$inferInsert;