import { z } from "zod";

export const cartItemSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  kind: z.enum(["book", "sunnah", "audio"]),
  title: z.string().trim().min(1).max(200),
  price: z.number().finite().min(0).max(1_000_000),
  meta: z.string().trim().max(300).optional(),
  quantity: z.number().int().min(1).max(99),
});

export const cartQuantitySchema = z.object({
  slug: z.string().trim().min(1).max(160),
  kind: z.enum(["book", "sunnah", "audio"]),
  quantity: z.number().int().min(0).max(99),
});

export const cartRemoveSchema = z.object({
  slug: z.string().trim().min(1).max(160),
  kind: z.enum(["book", "sunnah", "audio"]),
});
