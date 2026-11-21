/** Runtime validation for review copy and the review APIs. */
import { z } from "zod";

const text = (max = 600) => z.string().trim().max(max);

export const reviewCopySchema = z.object({
  section: z.object({
    eyebrow: text(120),
    title: text(200),
    description: text(600),
    linkLabel: text(80),
  }),
  page: z.object({
    eyebrow: text(120),
    title: text(250),
    description: text(1500),
    ratingValue: text(40),
    reviewCount: text(40),
    pills: z.array(text(120)).max(20),
    loveLabel: text(120),
    loveTitle: text(250),
    loveText: text(1000),
    lovePills: z.array(text(120)).max(20),
    heading: text(200),
    headingDescription: text(600),
    moderationNote: text(800),
    successTitle: text(200),
    successText: text(1000),
  }),
});

export type ReviewCopyInput = z.infer<typeof reviewCopySchema>;

const bookKind = z.enum(["book", "audio"]);

/** Public submission — name/location/userId are taken from the session. */
export const createReviewSchema = z.object({
  rating: z.number().int().min(1).max(5),
  title: z.string().trim().min(2).max(160),
  text: z.string().trim().min(10).max(3000),
  bookSlug: z.string().trim().min(1).max(160),
  bookTitle: z.string().trim().min(1).max(200),
  kind: bookKind.default("book"),
  location: z.string().trim().max(120).default(""),
});

/** Admin-created review — source is always forced to "admin" by the server. */
export const adminCreateReviewSchema = createReviewSchema.extend({
  name: z.string().trim().min(2).max(120),
  location: z.string().trim().max(120).default("Dhaka"),
  avatarColor: z
    .string()
    .trim()
    .regex(/^#[0-9a-fA-F]{6}$/, "Use a #RRGGBB colour")
    .default("#1877F2"),
  status: z.enum(["pending", "approved", "rejected"]).default("approved"),
  pinned: z.boolean().default(false),
});

export const reviewUpdateSchema = z.object({
  id: z.string().trim().min(1).max(80),
  status: z.enum(["pending", "approved", "rejected"]).optional(),
  pinned: z.boolean().optional(),
  reply: z.string().trim().max(2000).nullable().optional(),
  title: z.string().trim().min(2).max(160).optional(),
  text: z.string().trim().min(10).max(3000).optional(),
  rating: z.number().int().min(1).max(5).optional(),
  name: z.string().trim().min(2).max(120).optional(),
  location: z.string().trim().max(120).optional(),
  verified: z.boolean().optional(),
});

export const deleteReviewSchema = z.object({
  id: z.string().trim().min(1).max(80),
});
