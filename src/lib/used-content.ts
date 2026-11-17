/**
 * Editable content for the homepage "Pre-loved books" (used books) banner.
 * Buttons/links are intentionally fixed and are NOT editable here.
 * Persisted in localStorage (demo only — no backend).
 */

import { sectionDefaults } from "@/lib/section-content";

export interface UsedContent {
  eyebrow: string;
  titlePrefix: string;
  titleHighlight: string;
  description: string;
  badgeValue: string;
  badgeLabel: string;
  chip: string;
  imageSrc: string;
  imageAlt: string;
  features: string[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const USED_STORAGE_KEY = "talknestbd-used-books-v1";

const DEFAULT_IMAGE =
  "https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80";

const fallback = sectionDefaults["used-books"];

export const usedDefaults: UsedContent = {
  eyebrow: fallback?.eyebrow ?? "Pre-loved books",
  titlePrefix: "A book's second life, at ",
  titleHighlight: "half the price.",
  description:
    fallback?.description ??
    "Sell the books you have finished and buy another reader's favourites for less. Every exchange keeps a good story in circulation.",
  badgeValue: "50% off",
  badgeLabel: "Pre-loved prices",
  chip: "A second life for every book",
  imageSrc: DEFAULT_IMAGE,
  imageAlt: "A stack of pre-loved books",
  features: ["Checked condition", "Secure payment", "Fast delivery"],
};

export function cloneUsedDefaults(): UsedContent {
  return JSON.parse(JSON.stringify(usedDefaults)) as UsedContent;
}

function isContent(value: unknown): value is UsedContent {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.eyebrow === "string" &&
    typeof item.titlePrefix === "string" &&
    typeof item.titleHighlight === "string" &&
    typeof item.description === "string" &&
    typeof item.badgeValue === "string" &&
    typeof item.badgeLabel === "string" &&
    typeof item.chip === "string" &&
    typeof item.imageSrc === "string" &&
    typeof item.imageAlt === "string" &&
    Array.isArray(item.features) &&
    item.features.every((entry) => typeof entry === "string")
  );
}

export function readUsedContent(): UsedContent {
  const defaults = cloneUsedDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(USED_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as unknown;
    if (!isContent(parsed)) return defaults;
    return { ...defaults, ...parsed };
  } catch {
    return defaults;
  }
}

export function writeUsedContent(content: UsedContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(USED_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — the homepage banner updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearUsedContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(USED_STORAGE_KEY);
    return { ok: true, message: "Restored the original pre-loved books banner." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
