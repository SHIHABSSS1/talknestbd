/** Editable story content for the homepage, /stories and /stories/share. */

import { stories } from "@/data/community";
import { sectionDefaults } from "@/lib/section-content";
import type { Story } from "@/lib/types";

export interface StoryContent {
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
  stories: Story[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const STORY_STORAGE_KEY = "talknestbd-stories-v1";

const section = sectionDefaults.stories;

export const storyDefaults: StoryContent = {
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
    notice: "More than 210 stories shared by readers this month.",
  },
  page: {
    eyebrow: "Share to My Heart",
    title: "Your story, in every heart",
    description:
      "Every reader carries a story worth keeping. Share a memory, a turning point or an ordinary moment that stayed with you — in your own words, in your own voice or as a PDF diary.",
    stats: [
      { value: "210+", label: "Stories shared" },
      { value: "84", label: "Voice stories" },
      { value: "12K", label: "Reader family" },
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
    footerNote: " stories shared this month · every story belongs to its reader",
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
      "Our editorial team will review it and publish it if it fits the community.",
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
  stories,
};

export function cloneStoryDefaults(): StoryContent {
  return JSON.parse(JSON.stringify(storyDefaults)) as StoryContent;
}

function isStory(value: unknown): value is Story {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.title === "string" &&
    typeof item.excerpt === "string" &&
    (item.type === "voice" || item.type === "text" || item.type === "pdf") &&
    typeof item.likes === "number" &&
    typeof item.date === "string" &&
    typeof item.avatarColor === "string" &&
    (item.attachmentDataUrl === undefined || typeof item.attachmentDataUrl === "string") &&
    (item.audioDataUrl === undefined || typeof item.audioDataUrl === "string")
  );
}

export function readStoryContent(): StoryContent {
  const defaults = cloneStoryDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(STORY_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<StoryContent>;
    if (!Array.isArray(parsed.stories) || !parsed.stories.every(isStory)) return defaults;
    return {
      section: { ...defaults.section, ...parsed.section },
      home: {
        ...defaults.home,
        ...parsed.home,
        bullets: Array.isArray(parsed.home?.bullets) ? parsed.home.bullets : defaults.home.bullets,
      },
      page: {
        ...defaults.page,
        ...parsed.page,
        stats: Array.isArray(parsed.page?.stats) ? parsed.page.stats : defaults.page.stats,
        rules: Array.isArray(parsed.page?.rules) ? parsed.page.rules : defaults.page.rules,
      },
      share: {
        ...defaults.share,
        ...parsed.share,
        tips: Array.isArray(parsed.share?.tips) ? parsed.share.tips : defaults.share.tips,
      },
      stories: parsed.stories,
    };
  } catch {
    return defaults;
  }
}

export function writeStoryContent(content: StoryContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(STORY_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — story pages updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearStoryContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(STORY_STORAGE_KEY);
    return { ok: true, message: "Restored the original reader stories." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
