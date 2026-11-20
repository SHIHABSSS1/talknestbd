"use client";

import { UpSaleGrid } from "@/components/books/UpSaleGrid";
import { useUpSaleBooks } from "@/components/providers/UpSaleBooksProvider";
import type { UpSaleBook } from "@/lib/types";

export function UpSaleBooksGrid({
  className,
  books: suppliedBooks,
}: {
  className?: string;
  books?: UpSaleBook[];
}) {
  const { books } = useUpSaleBooks();
  return (
    <UpSaleGrid
      books={suppliedBooks ?? books}
      variant="page"
      className={className}
    />
  );
}
