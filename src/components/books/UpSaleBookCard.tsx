"use client";

import Link from "next/link";
import { ArrowUpRight, Plus, ShoppingBag } from "lucide-react";
import type { UpSaleBook } from "@/lib/types";
import { cn, formatPrice, toBn } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { BookCover } from "./BookCover";

export function UpSaleBookCard({ book }: { book: UpSaleBook }) {
  const { addItem } = useStore();
  const savings = Math.max(book.originalPrice - book.price, 0);

  const buyUsedCopy = () =>
    addItem({
      slug: book.cartSlug,
      kind: "book",
      title: book.title,
      price: book.price,
      meta: `Used · ${book.condition} · 50% up sale`,
    });

  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-[8px] border border-line bg-white transition-colors duration-200 hover:border-brand-300">
      <div className="p-2 pb-0 sm:p-2.5 sm:pb-0">
        <Link
          href={`/books/${book.bookSlug}`}
          className="relative block overflow-hidden rounded-[4px] bg-brand-50"
          aria-label={`${book.title} — compare with a new copy`}
        >
          <span className="block aspect-[3/4] p-1.5 sm:p-2">
            <span className="block h-full w-full transition-transform duration-500 group-hover:-translate-y-1">
              <BookCover
                book={{
                  title: book.title,
                  author: book.author,
                  publisher: "TalkNest Used Books",
                  cover: book.cover,
                }}
                size="sm"
              />
            </span>
          </span>
          <span className="absolute left-2 top-2 rounded-[3px] bg-ink/85 px-1.5 py-1 text-[8px] font-semibold leading-none text-white backdrop-blur sm:text-[9px]">
            {book.condition}
          </span>
          <span className="absolute right-2 top-2 inline-flex items-center gap-0.5 rounded-[3px] bg-sale px-1.5 py-1 text-[8px] font-bold leading-none text-ink sm:text-[9px]">
            <Plus size={8} />
            50% up
          </span>
          {book.stock <= 2 && (
            <span className="absolute bottom-2 left-2 rounded-[3px] bg-white/90 px-1.5 py-1 text-[8px] font-semibold leading-none text-brand-800 backdrop-blur">
              Only {toBn(book.stock)} left
            </span>
          )}
        </Link>
      </div>

      <div className="flex flex-1 flex-col p-2.5 sm:p-3">
        <span className="text-[8.5px] font-semibold uppercase tracking-[0.12em] text-sale">
          Used · 50% up sale
        </span>
        <Link href={`/books/${book.bookSlug}`} className="mt-0.5">
          <h3 className="line-clamp-2 text-[12px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-600 sm:text-[13px]">
            {book.title}
          </h3>
        </Link>
        <p className="mt-0.5 line-clamp-1 text-[10px] text-muted">{book.author}</p>

        <div className="mt-2 flex flex-wrap items-baseline gap-x-1.5 gap-y-0">
          <span className="font-display text-[17px] font-bold text-ink sm:text-lg">
            {formatPrice(book.price)}
          </span>
          <span className="text-[10px] text-muted line-through">
            {formatPrice(book.originalPrice)}
          </span>
          <span className="w-full text-[9px] text-brand-700 sm:w-auto">
            Save {formatPrice(savings)}
          </span>
        </div>

        <div className="mt-auto flex gap-1.5 pt-2.5">
          <button
            type="button"
            onClick={buyUsedCopy}
            className={cn(
              "inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-[4px] bg-brand-600",
              "text-[10px] font-semibold text-white transition-colors hover:bg-brand-700 sm:text-[11px]",
            )}
            aria-label={`Buy used copy of ${book.title} now`}
          >
            <ShoppingBag size={13} />
            Buy now
          </button>
          <Link
            href={`/books/${book.bookSlug}`}
            aria-label={`Compare ${book.title} with a new copy`}
            className="grid h-9 w-8 shrink-0 place-items-center rounded-[4px] border border-line bg-white text-body transition-colors hover:border-brand-300 hover:text-brand-700 sm:w-9"
          >
            <ArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </article>
  );
}
