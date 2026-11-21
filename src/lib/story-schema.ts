/** Runtime validation for the API-driven Reader Story Community. */
import { z } from "zod";

const text = (max: number) => z.string().trim().max(max);
const privateKey = (extensions: string) =>
  z
    .string()
    .trim()
    .regex(
      new RegExp(`^stories/[a-f0-9]{32}\\.(${extensions})$`),
      "Invalid uploaded file reference",
    );

export const storyCopySchema = z.object({
  section: z.object({
    eyebrow: text(120),
    title: text(200),
    description: text(800),
    linkLabel: text(80),
  }),
  home: z.object({
    bullets: z.array(text(200)).max(12),
    primaryLabel: text(80),
    secondaryLabel: text(80),
    notice: text(400),
  }),
  page: z.object({
    eyebrow: text(120),
    title: text(200),
    description: text(1200),
    stats: z
      .array(z.object({ value: text(40), label: text(120) }))
      .max(6),
    rulesEyebrow: text(120),
    rulesTitle: text(200),
    rules: z.array(text(300)).max(20),
    ctaEyebrow: text(120),
    ctaTitle: text(200),
    ctaText: text(800),
    ctaLabel: text(80),
    footerNote: text(300),
    primaryLabel: text(80),
  }),
  share: z.object({
    eyebrow: text(120),
    title: text(200),
    description: text(1200),
    badge: text(120),
    successTitle: text(200),
    successText: text(800),
    tipsTitle: text(200),
    tips: z.array(text(300)).max(20),
    reviewTitle: text(200),
    reviewText: text(800),
  }),
});

const base = z.object({
  name: z.string().trim().min(2).max(80),
  title: z.string().trim().min(4).max(200),
  excerpt: z.string().trim().min(1).max(600),
  body: z.string().trim().max(20000).default(""),
  type: z.enum(["voice", "text", "pdf"]),
  category: z.string().trim().min(1).max(60),
  coverUrl: z
    .string()
    .trim()
    .max(2048)
    .refine(
      (value) => !value || (value.startsWith("/media/") || /^https?:\/\//i.test(value)),
      "Cover must be a /media path or http(s) URL",
    )
    .optional()
    .default(""),
  avatarColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a hex colour")
    .default("#1877F2"),
  duration: text(30).optional().default(""),
  audioKey: privateKey("webm|mp3|m4a|mp4").optional().nullable(),
  attachmentKey: privateKey("pdf").optional().nullable(),
  attachmentName: text(200).optional().nullable(),
});

/**
 * Storefront submission. Identity is never taken from the body — the server
 * uses the Better Auth session. A story always starts as `pending`.
 */
export const storySubmitSchema = base.superRefine((value, context) => {
  if (value.type === "text" && value.body.trim().length < 40) {
    context.addIssue({
      code: "custom",
      path: ["body"],
      message: "Write at least 40 characters.",
    });
  }
  if (value.type === "voice" && !value.audioKey) {
    context.addIssue({
      code: "custom",
      path: ["audioKey"],
      message: "Record a voice story before submitting.",
    });
  }
  if (value.type === "pdf" && (!value.attachmentKey || !value.attachmentName)) {
    context.addIssue({
      code: "custom",
      path: ["attachmentKey"],
      message: "Upload a PDF before submitting.",
    });
  }
});

export const storyAdminCreateSchema = base.extend({
  status: z.enum(["pending", "published", "rejected", "draft"]),
  featured: z.boolean(),
});

export const storyAdminUpdateSchema = storyAdminCreateSchema.partial().extend({
  id: z.string().trim().min(1).max(80),
});

export const storyModerateSchema = z.object({
  id: z.string().trim().min(1).max(80),
  status: z.enum(["pending", "published", "rejected", "draft"]),
  featured: z.boolean().optional(),
});

export const idSchema = z.object({
  id: z.string().trim().min(1).max(80),
});

export const categorySchema = z.object({
  name: z.string().trim().min(2).max(60),
  description: text(300).default(""),
});
