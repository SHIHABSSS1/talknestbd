/**
 * Server-side validation for shelf content blocks.
 *
 * The Viral Books shelf stores both its heading copy and the books that belong
 * to it, so an admin edit published in one place is immediately visible in the
 * storefront rails and pages for every visitor.
 */
import { z } from "zod";

import { bookSchema } from "./book-schema";

export const shelfHeadingSchema = z.object({
  eyebrow: z.string().trim().max(120),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(600),
  linkLabel: z.string().trim().max(80),
});

export const viralShelfSchema = z.object({
  heading: shelfHeadingSchema,
  /** Bounded so a malformed or hand-edited document cannot bloat the page. */
  books: z.array(bookSchema).max(200),
});

export type ViralShelfInput = z.infer<typeof viralShelfSchema>;
