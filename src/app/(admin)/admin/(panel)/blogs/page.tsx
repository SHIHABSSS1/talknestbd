import type { Metadata } from "next";
import { BlogsManager } from "@/components/admin/BlogsManager";

export const metadata: Metadata = {
  title: "Blog posts",
};

export default function AdminBlogsPage() {
  return <BlogsManager />;
}
