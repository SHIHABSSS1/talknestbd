"use client";

import { useUpSaleBooks } from "@/components/providers/UpSaleBooksProvider";
import { toBn } from "@/lib/utils";

export function UpSaleCount({ count }: { count?: number }) {
  const { books } = useUpSaleBooks();
  return <>{toBn(count ?? books.length)} copies in stock</>;
}
