/**
 * Server-side validation for the hero document.
 *
 * Kept out of `hero-content.ts` on purpose: that module is imported by client
 * components, and zod does not belong in the browser bundle for this.
 *
 * Rules enforced here, not in the UI:
 * - at most MAX_HERO_BANNERS slides
 * - `src` must be an http(s) URL or a root-relative path served by /media —
 *   never a `data:` URL, so base64 images can never reach the database
 */
import { z } from "zod";

import { MAX_HERO_BANNERS } from "./hero-content";

const imageSource = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Image source must be an http(s) URL or a path starting with /",
  )
  .refine((value) => !value.startsWith("data:"), "Base64 data URLs are not allowed");

export const heroBannerSchema = z.object({
  id: z.string().trim().min(1).max(80),
  /** Unsplash photo id used by the built-in sample slides. */
  imageId: z
    .string()
    .trim()
    .max(200)
    .regex(/^[A-Za-z0-9_-]+$/, "Invalid Unsplash image id")
    .optional(),
  /** Uploaded file URL (/media/...) or an external image URL. */
  src: imageSource.optional(),
  alt: z.string().trim().max(300),
  position: z
    .string()
    .trim()
    .max(40)
    .regex(/^[\d.%\spx-]+$/i, "Use a CSS object-position such as 50% 45%")
    .optional(),
});

export const heroContentSchema = z.object({
  banners: z.array(heroBannerSchema).max(MAX_HERO_BANNERS),
});

export type HeroContentInput = z.infer<typeof heroContentSchema>;