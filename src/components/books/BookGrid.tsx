import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";
import { BookCard } from "./BookCard";

const gridColumns = {
  four: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4",
  five: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5",
  six: "grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6",
};

export function BookGrid({
  books,
  columns = "five",
  className,
}: {
  books: Book[];
  columns?: keyof typeof gridColumns;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "grid gap-x-3.5 gap-y-8 sm:gap-x-5 sm:gap-y-10",
        gridColumns[columns],
        className,
      )}
    >
      {books.map((book) => (
        <BookCard key={book.slug} book={book} />
      ))}
    </div>
  );
}
