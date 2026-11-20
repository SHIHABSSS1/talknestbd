/** Server-side validation for the sell-used-books content block. */
import { z } from "zod";

import { sellIconKeys, type SellIconKey } from "./sell-content";

const iconKeys = sellIconKeys.map((item) => item.key) as [
  SellIconKey,
  ...SellIconKey[],
];

const text = (max = 600) => z.string().trim().max(max);
const href = z
  .string()
  .trim()
  .max(500)
  .refine(
    (value) =>
      value === "/" ||
      value.startsWith("/") ||
      value.startsWith("#") ||
      /^https?:\/\//i.test(value) ||
      /^mailto:/i.test(value),
    "Link must be a route, anchor, http(s) URL or mailto link",
  );

const banner = z.object({
  eyebrow: text(120),
  title: text(200),
  description: text(600),
  linkLabel: text(80),
  linkHref: href,
  secondaryLabel: text(80),
  secondaryHref: href,
});

const step = z.object({
  id: z.string().trim().min(1).max(80),
  icon: z.enum(iconKeys),
  title: text(160),
  text: text(600),
});

const stat = z.object({
  id: z.string().trim().min(1).max(80),
  value: text(60),
  label: text(120),
});

const faq = z.object({
  id: z.string().trim().min(1).max(80),
  question: text(300),
  answer: text(1500),
});

const testimonial = z.object({
  id: z.string().trim().min(1).max(80),
  name: text(120),
  text: text(800),
});

const page = z.object({
  hero: z.object({
    eyebrow: text(120),
    title: text(250),
    description: text(1000),
    badges: z.array(text(160)).max(20),
  }),
  steps: z.array(step).max(30),
  why: z.object({
    eyebrow: text(120),
    title: text(250),
    description: text(1000),
    stats: z.array(stat).max(20),
    ctaPrimary: text(120),
    ctaPrimaryHref: href,
    ctaSecondary: text(120),
    ctaSecondaryHref: href,
  }),
  policyLink: z.object({ label: text(120), href }),
  accepted: z.array(text(300)).max(40),
  notAccepted: z.array(text(300)).max(40),
  assurances: z.array(text(300)).max(40),
  sellingNote: text(1500),
  testimonials: z.array(testimonial).max(30),
  faqs: z.array(faq).max(40),
  bottomCta: z.object({
    text: text(600),
    primaryLabel: text(120),
    primaryHref: href,
    secondaryLabel: text(120),
    secondaryHref: href,
  }),
  noteHeading: text(200),
});

const calculator = z.object({
  heading: text(250),
  subheading: text(1000),
  conditions: z
    .array(
      z.object({
        id: z.string().trim().min(1).max(80),
        label: text(120),
        rate: z.number().finite().min(0).max(100),
        note: text(400),
      }),
    )
    .max(20),
  cap: z.number().finite().min(0).max(10_000_000),
  disclaimer: text(1500),
  eligibilityNote: text(1500),
  submitLabel: text(120),
  successTitle: text(200),
  successText: text(1000),
});

export const sellContentSchema = z.object({
  banner,
  page,
  calculator,
});

export type SellContentInput = z.infer<typeof sellContentSchema>;
