// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { BlogsManager } from "@/components/admin/BlogsManager";

export const metadata: Metadata = {
  title: "Blog posts",
};

export default function AdminBlogsPage() {
  return <BlogsManager />;
}
