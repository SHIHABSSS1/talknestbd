/** Reader-submitted stories awaiting editorial review. */

import type { StoryType } from "@/lib/types";

export type StoryRequestStatus = "Pending" | "Approved" | "Rejected";

export interface StoryRequest {
  id: string;
  createdAt: string;
  name: string;
  title: string;
  type: StoryType;
  excerpt: string;
  body: string;
  attachmentName?: string;
  attachmentDataUrl?: string;
  audioUrl?: string;
  audioDataUrl?: string;
  status: StoryRequestStatus;
}

export const STORY_REQUESTS_KEY = "talknestbd-story-requests-v1";

export const storyRequestStatuses: StoryRequestStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
];

function isRequest(value: unknown): value is StoryRequest {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return (
    typeof item.id === "string" &&
    typeof item.createdAt === "string" &&
    typeof item.name === "string" &&
    typeof item.title === "string" &&
    (item.type === "voice" || item.type === "text" || item.type === "pdf") &&
    typeof item.excerpt === "string" &&
    typeof item.body === "string" &&
    (item.attachmentDataUrl === undefined || typeof item.attachmentDataUrl === "string") &&
    (item.audioDataUrl === undefined || typeof item.audioDataUrl === "string") &&
    typeof item.status === "string" &&
    storyRequestStatuses.includes(item.status as StoryRequestStatus)
  );
}

export function readStoryRequests(): StoryRequest[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORY_REQUESTS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) && parsed.every(isRequest) ? parsed : [];
  } catch {
    return [];
  }
}

export function addStoryRequest(request: StoryRequest): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORY_REQUESTS_KEY,
      JSON.stringify([request, ...readStoryRequests()]),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function updateStoryRequest(id: string, patch: Partial<StoryRequest>): void {
  if (typeof window === "undefined") return;
  try {
    const next = readStoryRequests().map((item) =>
      item.id === id ? { ...item, ...patch } : item,
    );
    window.localStorage.setItem(STORY_REQUESTS_KEY, JSON.stringify(next));
  } catch {
    // localStorage may be unavailable — demo only.
  }
}

export function removeStoryRequest(id: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(
      STORY_REQUESTS_KEY,
      JSON.stringify(readStoryRequests().filter((item) => item.id !== id)),
    );
  } catch {
    // localStorage may be unavailable — demo only.
  }
}
