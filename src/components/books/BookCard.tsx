"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Book } from "@/lib/types";
import { categoryLabel } from "@/data/categories";
import { discountPercent, cn, toBn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { BookCover } from "./BookCover";
import { Rating } from "@/components/ui/Rating";
import { Price } from "@/components/ui/Price";

function coverBadge(book: Book): { label: string; className: string } | null {
  if (book.tags.includes("bestseller")) {
    return { label: "বেস্ট সেলার", className: "bg-gold-500 text-forest-950" };
  }
  if (book.tags.includes("new")) {
    return { label: "নতুন", className: "bg-forest-900 text-cream-50" };
  }
  if (book.tags.includes("viral")) {
    return { label: "ভাইরাল", className: "bg-clay-500 text-cream-50" };
  }
  const discount = discountPercent(book.price, book.oldPrice);
  if (discount) {
    return {
      label: `${toBn(discount)}% ছাড়`,
      className: "bg-cream-50 text-clay-600",
    };
  }
  return null;
}

export function BookCard({ book, compact = false }: { book: Book; compact?: boolean }) {
  const { addItem, toggleWishlist, isWishlisted, hydrated } = useStore();
  const badge = coverBadge(book);
  const wished = hydrated && isWishlisted(book.slug);

  return (
    <article className="group flex h-full flex-col">
      <div className="relative">
        <Link
          href={`/books/${book.slug}`}
          className="block rounded-2xl bg-cream-100 p-2.5 ring-1 ring-forest-900/5 transition-all duration-300 group-hover:bg-cream-200/70 group-hover:ring-forest-900/10"
        >
          <div className={cn("aspect-[3/4] w-full overflow-hidden rounded-[7px] transition-transform duration-500 group-hover:-translate-y-1 group-hover:scale-[1.01]", compact ? "" : "")}>
            <BookCover book={book} size={compact ? "sm" : "md"} />
          </div>
        </Link>

        {badge && (
          <span
            className={cn(
              "pointer-events-none absolute left-4 top-4 rounded-full px-2.5 py-1 text-[9px] font-semibold shadow-sm sm:text-[10px]",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(book.slug)}
          aria-label={wished ? "উইশলিস্ট থেকে সরান" : "উইশলিস্টে যোগ করুন"}
          aria-pressed={wished}
          className="absolute right-4 top-4 grid h-8 w-8 place-items-center rounded-full bg-cream-50/90 text-forest-800 shadow-sm backdrop-blur transition hover:scale-105 hover:bg-cream-50 hover:text-clay-500"
        >
          <Heart
            size={15}
            className={wished ? "fill-clay-500 text-clay-500" : ""}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-3.5">
        <span className="text-[9px] font-semibold uppercase tracking-[0.16em] text-muted">
          {categoryLabel(book.category)}
        </span>
        <Link href={`/books/${book.slug}`} className="mt-1">
          <h3 className="line-clamp-2 font-display text-[15px] font-semibold leading-snug text-forest-950 transition-colors group-hover:text-forest-600 sm:text-base">
            {book.title}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 text-[11px] text-muted sm:text-xs">
          {book.author}
        </p>
        <div className="mt-1.5">
          <Rating value={book.rating} count={book.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-3">
          <Price price={book.price} oldPrice={book.oldPrice} size="sm" />
          <button
            type="button"
            onClick={() =>
              addItem({
                slug: book.slug,
                kind: "book",
                title: book.title,
                price: book.price,
                meta: book.author,
              })
            }
            aria-label={`${book.title} কার্টে যোগ করুন`}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50 transition-colors hover:bg-gold-500 hover:text-forest-950"
          >
            <ShoppingBag size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
