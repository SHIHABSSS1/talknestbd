import type { ReviewRow } from "@/lib/db/schema";
import type { Review } from "@/lib/types";

/** Human label for storefront cards, derived from the real createdAt value. */
export function formatReviewDate(value: Date | string): string {
  const date = typeof value === "string" ? new Date(value) : value;
  if (Number.isNaN(date.getTime())) return "Recently";
  const days = Math.floor((Date.now() - date.getTime()) / 86_400_000);
  if (days <= 0) return "Today";
  if (days === 1) return "Yesterday";
  if (days < 7) return `${days} days ago`;
  if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
  if (days < 365) return `${Math.floor(days / 30)} months ago`;
  return `${Math.floor(days / 365)} years ago`;
}

export function toReview(row: ReviewRow): Review {
  return {
    id: row.id,
    source: row.source as Review["source"],
    status: row.status as Review["status"],
    pinned: row.pinned,
    rating: row.rating,
    title: row.title,
    text: row.text,
    bookSlug: row.bookSlug,
    bookTitle: row.bookTitle,
    kind: row.bookKind as Review["kind"],
    name: row.name,
    location: row.location,
    date: formatReviewDate(row.createdAt),
    createdAt: row.createdAt.toISOString(),
    avatarColor: row.avatarColor,
    verified: row.verified,
    ...(row.reply ? { reply: row.reply } : {}),
    ...(row.replyDate ? { replyDate: row.replyDate.toISOString() } : {}),
  };
}
