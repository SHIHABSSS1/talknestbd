/**
 * Shared shapes for the admin snapshot backup screen.
 *
 * A snapshot freezes the editable content blocks (the same documents the
 * admin section editors write) so the shipped demo data can be restored after
 * a migration or a bad edit. No user-specific or payment data is captured.
 */

export const SNAPSHOT_KEYS = [
  "hero",
  "trust-strip",
  "categories",
  "shelf:viral-books",
  "authors",
  "publishers",
] as const;
export type SnapshotKey = (typeof SNAPSHOT_KEYS)[number];

export const SNAPSHOT_LABELS: Record<SnapshotKey, string> = {
  hero: "Homepage hero",
  "trust-strip": "Trust strip cards",
  categories: "Category showcase",
  "shelf:viral-books": "Viral Books shelf",
  authors: "Authors spotlight",
  publishers: "Publishers strip",
};

export interface SnapshotSummary {
  id: string;
  label: string;
  kind: string;
  note: string | null;
  createdAt: string;
}

export interface SnapshotResult {
  ok: boolean;
  message: string;
  snapshots?: SnapshotSummary[];
}
