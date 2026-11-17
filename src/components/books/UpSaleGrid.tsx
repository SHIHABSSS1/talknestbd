import type { UpSaleBook } from "@/lib/types";
import { cn } from "@/lib/utils";
import { UpSaleBookCard } from "./UpSaleBookCard";

export function UpSaleGrid({
  books,
  variant = "rail",
  className,
}: {
  books: UpSaleBook[];
  variant?: "rail" | "page";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-3 sm:gap-4",
        variant === "rail"
          ? "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6"
          : "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
        className,
      )}
    >
      {books.map((book) => (
        <UpSaleBookCard key={book.id} book={book} />
      ))}
    </div>
  );
}
