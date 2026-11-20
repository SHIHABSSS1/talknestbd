/** Server-side validation for the author content block. */
import { z } from "zod";

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

const section = z.object({
  eyebrow: z.string().trim().max(120),
  title: z.string().trim().max(160),
  description: z.string().trim().max(600),
  linkLabel: z.string().trim().max(80),
});

export const authorSchema = z.object({
  slug,
  name: z.string().trim().min(1).max(120),
  title: z.string().trim().max(120),
  bio: z.string().trim().max(2_000),
  longBio: z.array(z.string().trim().max(2_000)).max(40),
  image: imageSource.optional(),
  location: z.string().trim().max(120),
  quote: z.string().trim().max(600),
  featured: z.boolean(),
});

export const authorContentSchema = z.object({
  section,
  listing: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().max(160),
    description: z.string().trim().max(600),
    quoteLabel: z.string().trim().max(80),
    quote: z.string().trim().max(600),
    quoteBy: z.string().trim().max(120),
    pillCount: z.number().int().min(0).max(50),
  }),
  detail: z.object({
    featuredLabel: z.string().trim().max(80),
    authorLabel: z.string().trim().max(80),
    allAuthorsLabel: z.string().trim().max(80),
    browseBooksLabel: z.string().trim().max(80),
    booksHeadingPrefix: z.string().trim().max(80),
    booksHeading: z.string().trim().max(160),
    emptyNote: z.string().trim().max(300),
  }),
  authors: z.array(authorSchema).max(100),
});

export type AuthorContentInput = z.infer<typeof authorContentSchema>;
