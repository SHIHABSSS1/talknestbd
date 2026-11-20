/** Server-side validation for the wholesale content block. */
import { z } from "zod";

import {
  wholesaleIconKeys,
  type WholesaleIconKey,
} from "./wholesale-content";

const iconKeys = wholesaleIconKeys.map((item) => item.key) as [
  WholesaleIconKey,
  ...WholesaleIconKey[],
];
const text = (max = 600) => z.string().trim().max(max);
const id = z.string().trim().min(1).max(80);

const home = z.object({
  eyebrow: text(120),
  title: text(200),
  description: text(1000),
  wholesale: z.object({
    badge: text(120),
    heading: text(200),
    text: text(1000),
    cta: text(120),
    benefits: z.array(text(200)).max(20),
  }),
  freeOrder: z.object({
    badge: text(120),
    label: text(120),
    heading: text(200),
    text: text(1000),
    cta: text(120),
  }),
});

const page = z.object({
  hero: z.object({
    eyebrow: text(120),
    title: text(250),
    description: text(1500),
    badges: z.array(text(160)).max(20),
  }),
  priceList: z.object({
    heading: text(200),
    note: text(800),
    footer: text(300),
    termsLabel: text(120),
  }),
  tiers: z
    .array(
      z.object({
        id,
        name: text(120),
        quantity: text(120),
        commission: text(120),
        delivery: text(120),
        highlight: z.boolean(),
      }),
    )
    .max(30),
  benefits: z
    .array(
      z.object({
        id,
        icon: z.enum(iconKeys),
        title: text(200),
        text: text(800),
      }),
    )
    .max(30),
  popularHeading: text(200),
  catalogueLabel: text(120),
  whoHeading: text(200),
  who: z.array(text(250)).max(30),
  faqHeading: text(200),
  faqs: z
    .array(z.object({ id, question: text(400), answer: text(2000) }))
    .max(40),
  whatsapp: z.object({
    heading: text(200),
    text: text(800),
    linkLabel: text(120),
  }),
  bottomCta: z.object({ text: text(600), label: text(120) }),
});

const freeOrderPage = z.object({
  hero: z.object({
    eyebrow: text(120),
    title: text(250),
    description: text(1500),
    badges: z.array(text(160)).max(20),
  }),
  intro: z.object({ heading: text(250), text: text(1000), note: text(600) }),
  steps: z
    .array(z.object({ id, title: text(160), text: text(600) }))
    .max(20),
  charges: z.object({
    heading: text(200),
    description: text(800),
    zones: z
      .array(z.object({ id, label: text(160), charge: text(60) }))
      .max(20),
  }),
  goodToKnow: z.object({ heading: text(200), items: z.array(text(400)).max(20) }),
  cta: z.object({
    heading: text(200),
    text: text(800),
    primaryLabel: text(120),
    secondaryLabel: text(120),
  }),
});

export const wholesaleContentSchema = z.object({
  home,
  page,
  freeOrderPage,
});

export type WholesaleContentInput = z.infer<typeof wholesaleContentSchema>;
