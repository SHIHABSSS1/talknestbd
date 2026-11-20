/**
 * Server-side validation for the trust-strip document.
 *
 * Kept out of `trust-content.ts` on purpose: that module is imported by client
 * components, and zod does not belong in the browser bundle for this.
 *
 * Rules enforced here, not in the UI:
 * - at most MAX_TRUST_CARDS cards
 * - `src` must be an http(s) URL or a root-relative /media path — never a
 *   `data:` URL, so base64 cannot reach Postgres
 * - `href` must be a site route or an http(s) URL
 */
import { z } from "zod";

import {
  MAX_TRUST_CARDS,
  trustIconKeys,
  trustTints,
  type TrustIconKey,
  type TrustTintKey,
} from "./trust-content";

const iconKeys = trustIconKeys.map((item) => item.key) as [
  TrustIconKey,
  ...TrustIconKey[],
];
const tintKeys = Object.keys(trustTints) as [TrustTintKey, ...TrustTintKey[]];

const imageSource = z
  .string()
  .trim()
  .max(2048)
  .refine(
    (value) => /^https?:\/\//i.test(value) || value.startsWith("/"),
    "Image source must be an http(s) URL or a path starting with /",
  )
  .refine((value) => !value.startsWith("data:"), "Base64 data URLs are not allowed");

const cardHref = z
  .string()
  .trim()
  .max(300)
  .refine(
    (value) => value === "/" || value.startsWith("/") || /^https?:\/\//i.test(value),
    "Link must be a site route or an http(s) URL",
  );

export const trustCardSchema = z.object({
  id: z.string().trim().min(1).max(80),
  title: z.string().trim().max(120),
  text: z.string().trim().max(200),
  href: cardHref,
  icon: z.enum(iconKeys),
  tint: z.enum(tintKeys),
  src: imageSource.optional(),
});

export const trustContentSchema = z.object({
  cards: z.array(trustCardSchema).max(MAX_TRUST_CARDS),
});

export type TrustContentInput = z.infer<typeof trustContentSchema>;
