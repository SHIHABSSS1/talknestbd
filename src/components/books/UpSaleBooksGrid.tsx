"use client";

import { UpSaleGrid } from "@/components/books/UpSaleGrid";
import { useUpSaleBooks } from "@/components/providers/UpSaleBooksProvider";

export function UpSaleBooksGrid({ className }: { className?: string }) {
  const { books } = useUpSaleBooks();
  return <UpSaleGrid books={books} variant="page" className={className} />;
}
