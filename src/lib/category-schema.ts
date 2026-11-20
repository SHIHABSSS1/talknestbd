/**
 * Server-side validation for the category document.
 *
 * Kept out of `category-content.ts` on purpose: that module is imported by
 * client components, and zod does not belong in the browser bundle for this.
 *
 * Rules enforced here, not in the UI:
 * - bounded number of tiles and subcategories
 * - unique, lowercase ASCII slugs (they become /category/<slug> routes)
 * - `src` must be an http(s) URL or a root-relative path, never a data: URL
 * - accents must be a #RRGGBB hex value
 */
import { z } from "zod";

import {
  categoryIconKeys,
  MAX_CATEGORY_SUBCATEGORIES,
  MAX_CATEGORY_TILES,
  type CategoryIconKey,
} from "./category-content";

const iconKeys = categoryIconKeys.map((item) => item.key) as [
  CategoryIconKey,
  ...CategoryIconKey[],
];

const imageSource = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Image source must be an http(s) URL or a path starting with /",
  )
  .refine((value) => !value.startsWith("data:"), "Base64 data URLs are not allowed");

const slug = z
  .string()
  .trim()
  .min(1)
  .max(120)
  .regex(/^[a-z0-9-]{1,120}$/, "Use a lowercase hyphenated slug")
  .refine(
    (value) =>
      !value.startsWith("-") && !value.endsWith("-") && !value.includes("--"),
    "Slugs cannot start or end with a hyphen, or contain two in a row",
  );

export const categoryHeadingSchema = z.object({
  eyebrow: z.string().trim().max(120),
  title: z.string().trim().max(160),
  description: z.string().trim().max(600),
  linkLabel: z.string().trim().max(80),
});

export const categorySubcategorySchema = z.object({
  id: z.string().trim().min(1).max(80),
  name: z.string().trim().min(1).max(120),
  slug,
  description: z.string().trim().max(400).optional(),
});

export const categoryTileSchema = z.object({
  id: z.string().trim().min(1).max(80),
  slug,
  name: z.string().trim().min(1).max(120),
  englishName: z.string().trim().max(160),
  description: z.string().trim().max(600),
  href: z
    .string()
    .trim()
    .max(300)
    .refine(
      (value) => value === "/" || value.startsWith("/") || /^https?:\/\//i.test(value),
      "Link must be a site route or an http(s) URL",
    ),
  icon: z.enum(iconKeys),
  accent: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Accent must be a #RRGGBB colour"),
  src: imageSource.optional(),
  audio: z.boolean().optional(),
  subcategories: z.array(categorySubcategorySchema).max(MAX_CATEGORY_SUBCATEGORIES).default([]),
  homeBooks: z.boolean().default(true),
});

export const categoryContentSchema = z.object({
  heading: categoryHeadingSchema,
  tiles: z.array(categoryTileSchema).max(MAX_CATEGORY_TILES),
});

export type CategoryContentInput = z.infer<typeof categoryContentSchema>;
