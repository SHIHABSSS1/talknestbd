// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { SiteSettings } from "@/components/admin/SiteSettings";
import { listSnapshots } from "@/lib/db/queries/snapshots";

export const metadata: Metadata = {
  title: "Site settings",
};

export default async function AdminSettingsPage() {
  const snapshots = await listSnapshots();
  return <SiteSettings snapshots={snapshots} />;
}
