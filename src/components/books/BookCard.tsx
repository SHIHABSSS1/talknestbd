"use client";

import Link from "next/link";
import { Heart, ShoppingBag } from "lucide-react";
import type { Book } from "@/lib/types";
import { categoryLabel } from "@/data/categories";
import { discountPercent, cn, formatCount } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { BookCover } from "./BookCover";
import { Rating } from "@/components/ui/Rating";
import { Price } from "@/components/ui/Price";

function coverBadge(book: Book): { label: string; className: string } | null {
  if (book.tags.includes("bestseller")) {
    return { label: "Bestseller", className: "bg-brand-600 text-white" };
  }
  if (book.tags.includes("new")) {
    return { label: "New", className: "bg-ink text-white" };
  }
  if (book.tags.includes("viral")) {
    return { label: "Viral", className: "bg-sale text-ink" };
  }
  const discount = discountPercent(book.price, book.oldPrice);
  if (discount) {
    return {
      label: `${discount}% off`,
      className: "bg-sale text-ink",
    };
  }
  return null;
}

export function BookCard({ book, compact = false }: { book: Book; compact?: boolean }) {
  const { addItem, toggleWishlist, isWishlisted, hydrated } = useStore();
  const badge = coverBadge(book);
  const wished = hydrated && isWishlisted(book.slug);

  return (
    <article className="group flex h-full flex-col rounded-[8px] border border-line bg-white p-2.5 transition-colors duration-200 hover:border-brand-300 sm:p-3">
      <div className="relative">
        <Link href={`/books/${book.slug}`} className="block overflow-hidden rounded-[4px]">
          <div
            className={cn(
              "aspect-[3/4] w-full overflow-hidden rounded-[4px] transition-transform duration-300 group-hover:-translate-y-0.5",
              compact ? "" : "",
            )}
          >
            <BookCover book={book} size={compact ? "sm" : "md"} />
          </div>
        </Link>

        {badge && (
          <span
            className={cn(
              "pointer-events-none absolute left-2 top-2 rounded-[3px] px-2 py-1 text-[9px] font-medium leading-none sm:text-[10px]",
              badge.className,
            )}
          >
            {badge.label}
          </span>
        )}

        <button
          type="button"
          onClick={() => toggleWishlist(book.slug)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className="absolute right-2 top-2 grid h-7 w-7 place-items-center rounded-[4px] bg-white/95 text-body shadow-sm backdrop-blur transition hover:bg-white hover:text-brand-600 sm:h-8 sm:w-8"
        >
          <Heart
            size={14}
            className={wished ? "fill-brand-500 text-brand-500" : ""}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col pt-2.5">
        <span className="text-[10px] font-medium uppercase tracking-[0.08em] text-muted">
          {categoryLabel(book.category)}
        </span>
        <Link href={`/books/${book.slug}`} className="mt-1">
          <h3 className="line-clamp-2 text-[13px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-600 sm:text-sm">
            {book.title}
          </h3>
        </Link>
        <p className="mt-1 line-clamp-1 text-[11px] text-muted">
          {book.author}
        </p>
        <div className="mt-1.5">
          <Rating value={book.rating} count={book.reviewCount} />
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div>
            <Price price={book.price} oldPrice={book.oldPrice} size="sm" />
            {book.oldPrice && book.oldPrice > book.price && (
              <span className="mt-0.5 block text-[10px] font-medium text-sale">
                Save ৳{formatCount(book.oldPrice - book.price)}
              </span>
            )}
          </div>
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
            aria-label={`Add ${book.title} to cart`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-brand-600 text-white transition-colors hover:bg-brand-700 sm:h-9 sm:w-9"
          >
            <ShoppingBag size={14} />
          </button>
        </div>
      </div>
    </article>
  );
}
