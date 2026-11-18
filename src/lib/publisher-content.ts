/** Editable publisher content for the homepage strip, /publishers and detail pages. */

import { publishers as staticPublishers } from "@/data/publishers";
import { sectionDefaults } from "@/lib/section-content";
import type { Publisher } from "@/lib/types";

export interface PublisherContent {
  section: { eyebrow: string; title: string; description: string; linkLabel: string };
  listing: {
    eyebrow: string;
    title: string;
    description: string;
    ctaLabel: string;
    ctaTitle: string;
    ctaDescription: string;
    ctaLinkLabel: string;
  };
  detail: {
    label: string;
    originalLabel: string;
    booksHeadingPrefix: string;
    emptyNote: string;
  };
  publishers: Publisher[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const PUBLISHER_STORAGE_KEY = "talknestbd-publishers-v1";

const section = sectionDefaults.publishers;

export const publisherDefaults: PublisherContent = {
  section: {
    eyebrow: section?.eyebrow ?? "Our publishers",
    title: section?.title ?? "Independent voices, trusted presses",
    description: section?.description ?? "",
    linkLabel: section?.linkLabel ?? "All publishers",
  },
  listing: {
    eyebrow: "Our Publishers",
    title: "The publishers who bring books to readers",
    description:
      "Curated publisher catalogues, their stories and collections — all in one place. We work directly with every publisher.",
    ctaLabel: "For Publishers",
    ctaTitle: "Bring your publishing house to TalkNest",
    ctaDescription: "Reach more readers across Bangladesh with simple listing and bulk ordering.",
    ctaLinkLabel: "Get in touch",
  },
  detail: {
    label: "Publisher",
    originalLabel: "100% original",
    booksHeadingPrefix: "Books by",
    emptyNote: "This publisher's books are coming soon.",
  },
  publishers: staticPublishers,
};

export function clonePublisherDefaults(): PublisherContent {
  return JSON.parse(JSON.stringify(publisherDefaults)) as PublisherContent;
}

function isPublisher(value: unknown): value is Publisher {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.slug === "string" &&
    typeof item.name === "string" &&
    typeof item.tagline === "string" &&
    typeof item.description === "string" &&
    typeof item.established === "string" &&
    typeof item.location === "string" &&
    typeof item.initials === "string" &&
    typeof item.accent === "string" &&
    typeof item.featured === "boolean" &&
    (item.imageSrc === undefined || typeof item.imageSrc === "string")
  );
}

export function readPublisherContent(): PublisherContent {
  const defaults = clonePublisherDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(PUBLISHER_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<PublisherContent>;
    if (!Array.isArray(parsed.publishers) || !parsed.publishers.every(isPublisher)) return defaults;
    return {
      section: { ...defaults.section, ...parsed.section },
      listing: { ...defaults.listing, ...parsed.listing },
      detail: { ...defaults.detail, ...parsed.detail },
      publishers: parsed.publishers,
    };
  } catch {
    return defaults;
  }
}

export function writePublisherContent(content: PublisherContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(PUBLISHER_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — publisher pages updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearPublisherContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(PUBLISHER_STORAGE_KEY);
    return { ok: true, message: "Restored the original publishers." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
