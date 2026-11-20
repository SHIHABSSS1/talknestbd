/** Server-side validation for the used-books banner content block. */
import { z } from "zod";

const imageSource = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Image source must be an http(s) URL or a path starting with /",
  )
  .refine((value) => !value.startsWith("data:"), "Base64 data URLs are not allowed");

export const usedContentSchema = z.object({
  eyebrow: z.string().trim().max(120),
  titlePrefix: z.string().trim().max(200),
  titleHighlight: z.string().trim().max(200),
  description: z.string().trim().max(1000),
  badgeValue: z.string().trim().max(60),
  badgeLabel: z.string().trim().max(120),
  chip: z.string().trim().max(200),
  imageSrc: imageSource,
  imageAlt: z.string().trim().max(300),
  features: z.array(z.string().trim().max(200)).max(20),
});

export type UsedContentInput = z.infer<typeof usedContentSchema>;
