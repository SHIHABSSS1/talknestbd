/** Public view models for the API-driven Reader Story Community. */
import type { StoryCategoryRow, StoryRow } from "@/lib/db/schema";

export type SaveResult = { ok: boolean; message: string };

export type StoryView = {
  id: string;
  slug: string;
  name: string;
  title: string;
  excerpt: string;
  body: string;
  type: "voice" | "text" | "pdf";
  category: string;
  coverUrl: string | null;
  avatarColor: string;
  duration: string | null;
  attachmentName: string | null;
  /** Booleans only — private storage keys are never sent to the browser. */
  hasAudio: boolean;
  hasPdf: boolean;
  likes: number;
  likedByMe: boolean;
  status: string;
  featured: boolean;
  authorId: string | null;
  authorImage: string | null;
  publishedAt: string | null;
  createdAt: string;
};

export type StoryCategoryView = {
  id: string;
  name: string;
  slug: string;
  description: string;
};

const iso = (value: Date | null): string | null => (value ? value.toISOString() : null);

export function toStoryView(
  row: StoryRow,
  options: { likedByMe?: boolean; authorImage?: string | null } = {},
): StoryView {
  return {
    id: row.id,
    slug: row.slug,
    name: row.name,
    title: row.title,
    excerpt: row.excerpt,
    body: row.body,
    type: row.type === "voice" || row.type === "pdf" ? row.type : "text",
    category: row.category,
    coverUrl: row.coverUrl,
    avatarColor: row.avatarColor,
    duration: row.duration,
    attachmentName: row.attachmentName,
    hasAudio: Boolean(row.audioKey),
    hasPdf: Boolean(row.attachmentKey),
    likes: row.likes,
    likedByMe: options.likedByMe ?? false,
    status: row.status,
    featured: row.featured,
    authorId: row.userId,
    authorImage: options.authorImage ?? null,
    publishedAt: iso(row.publishedAt),
    createdAt: row.createdAt.toISOString(),
  };
}

export function toStoryCategoryView(row: StoryCategoryRow): StoryCategoryView {
  return { id: row.id, name: row.name, slug: row.slug, description: row.description };
}
