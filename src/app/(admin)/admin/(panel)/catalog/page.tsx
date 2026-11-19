// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { CatalogManager } from "@/components/admin/CatalogManager";

export const metadata: Metadata = {
  title: "All books view",
};

export default function AdminCatalogPage() {
  return <CatalogManager />;
}
