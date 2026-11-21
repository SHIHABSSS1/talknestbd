// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminStoriesManager } from "@/components/admin/AdminStoriesManager";
import { getStoryCopy } from "@/lib/db/queries/stories";
import { findAdminNavItem } from "@/lib/admin-nav";

export const metadata: Metadata = { title: "Story community" };

export default async function AdminStoriesPage() {
  const label = findAdminNavItem("/admin/stories")?.label ?? "Story community";
  const copy = await getStoryCopy();
  return (
    <Suspense fallback={<p className="text-[12px] text-muted">Loading stories…</p>}>
      <AdminStoriesManager label={label} initialTab="review" initialCopy={copy} />
    </Suspense>
  );
}
