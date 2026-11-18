/** Editable review content for the homepage wall, /reviews and book detail pages. */

import { reviews as staticReviews } from "@/data/reviews";
import { sectionDefaults } from "@/lib/section-content";
import type { Review } from "@/lib/types";

export interface ReviewContent {
  section: { eyebrow: string; title: string; description: string; linkLabel: string };
  page: {
    eyebrow: string;
    title: string;
    description: string;
    ratingValue: string;
    reviewCount: string;
    pills: string[];
    loveLabel: string;
    loveTitle: string;
    loveText: string;
    lovePills: string[];
    heading: string;
    headingDescription: string;
    moderationNote: string;
    successTitle: string;
    successText: string;
  };
  reviews: Review[];
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const REVIEW_STORAGE_KEY = "talknestbd-reviews-v1";

const section = sectionDefaults.reviews;

export const reviewDefaults: ReviewContent = {
  section: {
    eyebrow: section?.eyebrow ?? "Reader reviews",
    title: section?.title ?? "What readers are saying",
    description: section?.description ?? "",
    linkLabel: section?.linkLabel ?? "All reviews",
  },
  page: {
    eyebrow: "Reader Reviews",
    title: "Reader voices, our promise",
    description:
      "Every review teaches us something, and every opinion helps the next reader. Learn from other readers before you buy, then share how your own experience went.",
    ratingValue: "4.9",
    reviewCount: "1240",
    pills: ["+ verified reviews", "average rating", "reader opinions"],
    loveLabel: "Reader Love",
    loveTitle: "Your love as a reader is our greatest reward",
    loveText: "Books, delivery and service — your experience shapes what we do next.",
    lovePills: ["% recommend", "-hour delivery"],
    heading: "Reader reviews",
    headingDescription: "Curated experiences and opinions on our books",
    moderationNote:
      "Every review is checked before publishing. Insulting or promotional content is not published.",
    successTitle: "Thank you — your review has been submitted",
    successText:
      "Our team will check it and publish it after verification. In this demo the request is stored only in this browser.",
  },
  reviews: staticReviews,
};

export function cloneReviewDefaults(): ReviewContent {
  return JSON.parse(JSON.stringify(reviewDefaults)) as ReviewContent;
}

function isReview(value: unknown): value is Review {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.name === "string" &&
    typeof item.location === "string" &&
    typeof item.rating === "number" &&
    typeof item.text === "string" &&
    typeof item.bookTitle === "string" &&
    typeof item.bookSlug === "string" &&
    typeof item.date === "string" &&
    typeof item.avatarColor === "string" &&
    typeof item.verified === "boolean" &&
    (item.reply === undefined || typeof item.reply === "string") &&
    (item.replyDate === undefined || typeof item.replyDate === "string")
  );
}

export function readReviewContent(): ReviewContent {
  const defaults = cloneReviewDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(REVIEW_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<ReviewContent>;
    if (!Array.isArray(parsed.reviews) || !parsed.reviews.every(isReview)) return defaults;
    return {
      section: { ...defaults.section, ...parsed.section },
      page: { ...defaults.page, ...parsed.page },
      reviews: parsed.reviews,
    };
  } catch {
    return defaults;
  }
}

export function writeReviewContent(content: ReviewContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(REVIEW_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — review pages updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearReviewContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(REVIEW_STORAGE_KEY);
    return { ok: true, message: "Restored the original reader reviews." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
