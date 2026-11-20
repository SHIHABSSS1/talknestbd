import "server-only";

import { desc } from "drizzle-orm";

import { db } from "@/lib/db";
import { dataSnapshots } from "@/lib/db/schema";
import type { SnapshotSummary } from "@/lib/snapshots";

/**
 * Admin-only list of stored snapshots. Deliberately not wrapped in `"use
 * cache"` — snapshots are an admin view and must never be served from a shared
 * cache. The settings route is already behind requireAdmin().
 */
export async function listSnapshots(): Promise<SnapshotSummary[]> {
  const rows = await db
    .select({
      id: dataSnapshots.id,
      label: dataSnapshots.label,
      kind: dataSnapshots.kind,
      note: dataSnapshots.note,
      createdAt: dataSnapshots.createdAt,
    })
    .from(dataSnapshots)
    .orderBy(desc(dataSnapshots.createdAt));

  return rows.map((row) => ({
    id: row.id,
    label: row.label,
    kind: row.kind,
    note: row.note,
    createdAt: row.createdAt.toISOString(),
  }));
}
