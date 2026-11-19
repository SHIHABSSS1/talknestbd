// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { BooksManager } from "@/components/admin/BooksManager";
import { books } from "@/data/books";

export const metadata: Metadata = {
  title: "Books",
};

export default function AdminBooksPage() {
  return <BooksManager books={books} />;
}
