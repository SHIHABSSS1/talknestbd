"use client";

import { useUpSaleBooks } from "@/components/providers/UpSaleBooksProvider";
import { toBn } from "@/lib/utils";

export function UpSaleCount() {
  const { books } = useUpSaleBooks();
  return <>{toBn(books.length)} copies in stock</>;
}
