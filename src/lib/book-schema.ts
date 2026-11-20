/**
 * Server-side validation for a `Book` document stored in Postgres.
 *
 * Kept out of `book-content.ts` (client-safe) on purpose: zod does not belong
 * in the browser bundle. Covers uploaded *and* demo books so a saved shelf or
 * category cannot smuggle arbitrary JSON into a content block.
 *
 * Cover images must already be uploaded through /api/uploads — `data:` URLs are
 * rejected, so base64 never reaches the database.
 */
import { z } from "zod";

import type { BookTag, CoverMotif } from "./types";

const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]{1,120}$/, "Use a lowercase hyphenated slug")
  .refine(
    (value) =>
      !value.startsWith("-") && !value.endsWith("-") && !value.includes("--"),
    "Invalid slug",
  );

const imageSource = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Image source must be an http(s) URL or a path starting with /",
  )
  .refine((value) => !value.startsWith("data:"), "Base64 data URLs are not allowed");

const hex = z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a #RRGGBB colour");

const motifs = ["arch", "circle", "lines", "star", "wave", "grid"] as [
  CoverMotif,
  ...CoverMotif[],
];
const tags = [
  "bestseller",
  "new",
  "viral",
  "free-delivery",
  "up-sale",
  "trending",
  "sunnah",
  "international",
  "student",
  "audio",
] as [BookTag, ...BookTag[]];

export const bookCoverSchema = z.object({
  from: hex,
  to: hex,
  accent: hex,
  motif: z.enum(motifs),
  imageSrc: imageSource.optional(),
});

export const bookSchema = z.object({
  slug,
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(200).optional(),
  author: z.string().trim().min(1).max(120),
  authorSlug: slug,
  publisher: z.string().trim().min(1).max(120),
  publisherSlug: slug,
  category: slug,
  subcategory: slug.optional(),
  price: z.number().finite().min(0).max(1_000_000),
  oldPrice: z.number().finite().min(0).max(1_000_000).optional(),
  rating: z.number().finite().min(0).max(5),
  reviewCount: z.number().int().min(0).max(1_000_000),
  pages: z.number().int().min(0).max(10_000),
  language: z.string().trim().max(60),
  binding: z.string().trim().max(60),
  publishedYear: z.number().int().min(1900).max(2100),
  stock: z.number().int().min(0).max(1_000_000),
  description: z.string().trim().max(5_000),
  longDescription: z.array(z.string().trim().max(2_000)).max(40),
  highlights: z.array(z.string().trim().max(300)).max(20),
  cover: bookCoverSchema,
  tags: z.array(z.enum(tags)).max(tags.length),
  audio: z
    .object({
      duration: z.string().trim().max(40),
      narrator: z.string().trim().max(120),
    })
    .optional(),
  /** Optional ISBN shown on the book detail page. */
  isbn: z.string().trim().max(40).optional(),
});

export type BookInput = z.infer<typeof bookSchema>;
