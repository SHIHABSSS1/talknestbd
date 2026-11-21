/** Runtime validation for the audiobook catalogue and section copy. */
import { z } from "zod";

const cover = z.object({
  from: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  to: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  accent: z.string().trim().regex(/^#[0-9a-fA-F]{6}$/),
  motif: z.enum(["arch", "circle", "lines", "star", "wave", "grid"]),
  imageSrc: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
      "Cover image must be a /media path or http(s) URL",
    )
    .refine((value) => !value.startsWith("data:"), "Base64 is not allowed")
    .optional(),
});

const chapter = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().min(1).max(160),
  duration: z.string().trim().max(40),
  src: z
    .string()
    .trim()
    .min(1)
    .max(2048)
    .refine(
      (value) =>
        value.startsWith("/media/") || /^https?:\/\//i.test(value),
      "Audio source must be a /media path or http(s) URL",
    )
    .refine((value) => !value.startsWith("data:"), "Base64 is not allowed"),
  free: z.boolean(),
});

const base = z.object({
  title: z.string().trim().min(1).max(200),
  subtitle: z.string().trim().max(200).optional(),
  author: z.string().trim().min(1).max(120),
  authorSlug: z.string().trim().max(160).optional(),
  publisher: z.string().trim().max(120).optional(),
  publisherSlug: z.string().trim().max(160).optional(),
  narrator: z.string().trim().max(120),
  source: z.string().trim().max(200),
  duration: z.string().trim().min(1).max(40),
  description: z.string().trim().max(5000),
  longDescription: z.array(z.string().trim().max(2000)).max(40),
  highlights: z.array(z.string().trim().max(300)).max(20),
  category: z.string().trim().max(120),
  subcategory: z.string().trim().max(120).optional(),
  price: z.number().finite().min(0).max(1_000_000),
  oldPrice: z.number().finite().min(0).max(1_000_000).optional(),
  free: z.boolean(),
  status: z.enum(["draft", "published"]),
  featured: z.boolean(),
  cover,
  rating: z.number().finite().min(0).max(5).optional(),
  reviewCount: z.number().int().min(0).optional(),
  pages: z.number().int().min(0).optional(),
  language: z.string().trim().max(60).optional(),
  binding: z.string().trim().max(60).optional(),
  publishedYear: z.number().int().min(1900).max(2100).optional(),
  stock: z.number().int().min(0).optional(),
  isbn: z.string().trim().max(40).optional(),
  chapters: z.array(chapter).min(1).max(100),
});

export const createAudiobookSchema = base.extend({
  slug: z
    .string()
    .trim()
    .min(1)
    .max(160)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use a lowercase hyphenated slug"),
});

export const updateAudiobookSchema = base.partial().extend({
  id: z.string().trim().min(1).max(80),
});

export const deleteAudiobookSchema = z.object({
  id: z.string().trim().min(1).max(80),
});

export const audioCopySchema = z.object({
  section: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().max(200),
    description: z.string().trim().max(800),
    linkLabel: z.string().trim().max(80),
    featuredSlug: z.string().trim().max(160),
  }),
  library: z.object({
    eyebrow: z.string().trim().max(120),
    title: z.string().trim().max(200),
    description: z.string().trim().max(1200),
    badges: z.array(z.string().trim().max(160)).max(20),
    freeNote: z.string().trim().max(600),
    previewNote: z.string().trim().max(600),
  }),
  pricing: z.object({
    minPrice: z.number().finite().min(0).max(100000),
    unlockNote: z.string().trim().max(600),
    ownedLabel: z.string().trim().max(80),
    freeLabel: z.string().trim().max(80),
    paidLabel: z.string().trim().max(80),
  }),
});
