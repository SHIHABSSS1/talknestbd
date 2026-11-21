import { z } from "zod";

/** Book slugs are lowercase ASCII hyphenated strings. */
export const wishlistSlugSchema = z
  .string()
  .trim()
  .min(1)
  .max(160)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Invalid book slug");

export const wishlistAddSchema = z.object({
  slug: wishlistSlugSchema,
});

export const wishlistRemoveSchema = z.object({
  slug: wishlistSlugSchema,
});

/** Unguessable token issued to anonymous visitors and kept in localStorage. */
export const guestTokenSchema = z.string().uuid();
