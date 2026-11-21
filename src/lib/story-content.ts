/**
 * Editable copy for the Reader Story Community.
 *
 * Stories, likes and submissions now live in Postgres. This document only
 * holds the words an admin edits on the homepage, /stories and /stories/share
 * copy tabs; it is stored in content_blocks('stories').
 */
import { sectionDefaults } from "@/lib/section-content";

export interface StoryCopy {
  section: { eyebrow: string; title: string; description: string; linkLabel: string };
  home: {
    bullets: string[];
    primaryLabel: string;
    secondaryLabel: string;
    notice: string;
  };
  page: {
    eyebrow: string;
    title: string;
    description: string;
    stats: { value: string; label: string }[];
    rulesEyebrow: string;
    rulesTitle: string;
    rules: string[];
    ctaEyebrow: string;
    ctaTitle: string;
    ctaText: string;
    ctaLabel: string;
    footerNote: string;
    primaryLabel: string;
  };
  share: {
    eyebrow: string;
    title: string;
    description: string;
    badge: string;
    successTitle: string;
    successText: string;
    tipsTitle: string;
    tips: string[];
    reviewTitle: string;
    reviewText: string;
  };
}

export type SaveResult = { ok: boolean; message: string };

export const STORIES_CONTENT_KEY = "stories";

const section = sectionDefaults[STORIES_CONTENT_KEY];

export const storyDefaults: StoryCopy = {
  section: {
    eyebrow: section?.eyebrow ?? "Reader stories",
    title: section?.title ?? "Your story belongs here",
    description: section?.description ?? "",
    linkLabel: section?.linkLabel ?? "All stories",
  },
  home: {
    bullets: [
      "Record a story in your own voice",
      "Write and share a memory",
      "Upload a PDF diary or letter",
    ],
    primaryLabel: "Share your story",
    secondaryLabel: "Read all stories",
    notice: "Every story in the community was shared by a reader.",
  },
  page: {
    eyebrow: "Share to My Heart",
    title: "Your story, in every heart",
    description:
      "Every reader carries a story worth keeping. Share a memory, a turning point or an ordinary moment that stayed with you — in your own words, in your own voice or as a PDF diary.",
    stats: [
      { value: "Voice", label: "Tell it in your own words" },
      { value: "Written", label: "A memory worth keeping" },
      { value: "PDF", label: "A diary or letter" },
    ],
    rulesEyebrow: "Simple rules for sharing",
    rulesTitle: "A few things to keep in mind",
    rules: [
      "Write or speak from your own experience",
      "Keep names and places private unless you have permission",
      "Be kind — no insults, spam or promotions",
      "Our editorial team reviews every story before publication",
      "You can share in Bangla or English",
      "Voice stories work best in a quiet room",
    ],
    ctaEyebrow: "Your turn",
    ctaTitle: "Share one story and change someone's day",
    ctaText:
      "A small memory can be the exact thing another reader needed to hear today.",
    ctaLabel: "Start your story",
    footerNote: "stories shared by readers · every story belongs to its author",
    primaryLabel: "Share your story",
  },
  share: {
    eyebrow: "Share to My Heart",
    title: "Tell us your story",
    description:
      "Write it, record it in your voice or upload a PDF. Our editors read every submission before it appears on the site.",
    badge: "Voice · Written · PDF",
    successTitle: "Thank you — your story has reached us",
    successText:
      "Our editorial team will review it and publish it if it fits the community. You can follow its status from your account.",
    tipsTitle: "Quick tips for a good story",
    tips: [
      "Start with a moment, not a summary",
      "Describe what you saw, heard and felt",
      "Keep it short — two or three minutes is plenty",
      "Use your own voice; it is the part readers remember",
      "End with what the moment taught you",
    ],
    reviewTitle: "Editorial review",
    reviewText:
      "Every submission is checked before publication. We may ask for small edits, and we never publish without your go-ahead.",
  },
};

export function cloneStoryDefaults(): StoryCopy {
  return JSON.parse(JSON.stringify(storyDefaults)) as StoryCopy;
}
