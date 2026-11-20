/** Server-side validation for the publisher content block. */
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

export const publisherSchema = z.object({
  slug,
  name: z.string().trim().min(1).max(120),
  tagline: z.string().trim().max(200),
  description: z.string().trim().max(2_000),
  established: z.string().trim().max(40),
  location: z.string().trim().max(120),
  initials: z.string().trim().min(1).max(10),
  accent: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/, "Use a #RRGGBB colour"),
  featured: z.boolean(),
  imageSrc: imageSource.optional(),
});

export const publisherContentSchema = z.object({
  section,
  listing: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().max(160),
    description: z.string().trim().max(600),
    ctaLabel: z.string().trim().max(80),
    ctaTitle: z.string().trim().max(160),
    ctaDescription: z.string().trim().max(600),
    ctaLinkLabel: z.string().trim().max(80),
  }),
  detail: z.object({
    label: z.string().trim().max(80),
    originalLabel: z.string().trim().max(80),
    booksHeadingPrefix: z.string().trim().max(80),
    emptyNote: z.string().trim().max(300),
  }),
  publishers: z.array(publisherSchema).max(100),
});

export type PublisherContentInput = z.infer<typeof publisherContentSchema>;
