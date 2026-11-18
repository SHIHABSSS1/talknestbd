/** Reader-submitted reviews awaiting moderation. */

export type ReviewRequestStatus = "Pending" | "Approved" | "Rejected";

export interface ReviewRequest {
  id: string;
  createdAt: string;
  name: string;
  location: string;
  rating: number;
  text: string;
  bookSlug: string;
  bookTitle: string;
  status: ReviewRequestStatus;
}

export const REVIEW_REQUESTS_KEY = "talknestbd-review-requests-v1";

export const reviewRequestStatuses: ReviewRequestStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
];

function isRequest(value: unknown): value is ReviewRequest {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.name === "string" &&
    typeof item.location === "string" &&
    typeof item.rating === "number" &&
    typeof item.text === "string" &&
    typeof item.bookSlug === "string" &&
    typeof item.bookTitle === "string" &&
    typeof item.status === "string" &&
    reviewRequestStatuses.includes(item.status as ReviewRequestStatus)
  );
}

export function readReviewRequests(): ReviewRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(REVIEW_REQUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every(isRequest) ? parsed : [];
  } catch {
    return [];
  }
}

export function addReviewRequest(request: ReviewRequest): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      REVIEW_REQUESTS_KEY,
      JSON.stringify([request, ...readReviewRequests()]),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function updateReviewRequest(id: string, patch: Partial<ReviewRequest>): void {
  if (typeof window === "undefined") return;
  try {
    const next = readReviewRequests().map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
    window.localStorage.setItem(REVIEW_REQUESTS_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function removeReviewRequest(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      REVIEW_REQUESTS_KEY,
      JSON.stringify(readReviewRequests().filter((item) => item.id !== id)),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}
