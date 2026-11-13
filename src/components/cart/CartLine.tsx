"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/lib/store";
import { books } from "@/data/books";
import { sunnahItems } from "@/data/sunnah";
import { formatPrice, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";

export function CartLine({
  item,
  onQuantity,
  onRemove,
}: {
  item: CartItem;
  onQuantity: (quantity: number) => void;
  onRemove: () => void;
}) {
  const book = item.kind !== "sunnah" ? books.find((entry) => entry.slug === item.slug) : undefined;
  const sunnah = item.kind === "sunnah" ? sunnahItems.find((entry) => entry.slug === item.slug) : undefined;
  const href =
    item.kind === "audio"
      ? "/audio-books"
      : book
        ? `/books/${book.slug}`
        : sunnah
          ? `/sunnah-items/${sunnah.slug}`
          : "/sunnah-items";

  return (
    <article className="flex gap-3 border-b border-forest-900/8 py-4 last:border-b-0 sm:gap-4 sm:py-5">
      <Link
        href={href}
        className="relative block h-24 w-[68px] shrink-0 overflow-hidden rounded-lg bg-cream-100 sm:h-28 sm:w-20"
        aria-label={item.title}
      >
        {book ? (
          <BookCover book={book} size="sm" />
        ) : (
          <span
            className="grid h-full w-full place-items-center px-1 text-center font-display text-[11px] font-semibold leading-tight"
            style={{
              background: `linear-gradient(145deg, ${sunnah?.accent ?? "#1b5b45"}18, ${sunnah?.accent ?? "#1b5b45"}38)`,
              color: sunnah?.accent ?? "#1b5b45",
            }}
          >
            {item.title}
          </span>
        )}
      </Link>

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <span className="text-[9px] font-semibold uppercase tracking-[0.14em] text-muted">
              {item.kind === "book"
                ? "Book"
                : item.kind === "audio"
                  ? "Audiobook"
                  : "Sunnah item"}
            </span>
            <Link href={href} className="mt-0.5 block">
              <h3 className="line-clamp-2 font-display text-sm font-semibold leading-snug text-forest-950 transition-colors hover:text-forest-600 sm:text-base">
                {item.title}
              </h3>
            </Link>
            {item.meta && (
              <p className="mt-0.5 line-clamp-1 text-[10px] text-muted sm:text-[11px]">
                {item.meta}
              </p>
            )}
          </div>
          <button
            type="button"
            onClick={onRemove}
            aria-label={`${item.title} — remove from cart`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-forest-800/50 transition-colors hover:bg-clay-500/10 hover:text-clay-500"
          >
            <Trash2 size={15} />
          </button>
        </div>

        <div className="mt-auto flex flex-wrap items-end justify-between gap-2 pt-3">
          <div className="inline-flex h-9 items-center rounded-full border border-forest-900/12 bg-cream-50">
            <button
              type="button"
              onClick={() => onQuantity(item.quantity - 1)}
              aria-label="Decrease quantity"
              className="grid h-9 w-8 place-items-center text-forest-800 transition-colors hover:text-clay-500"
            >
              <Minus size={13} />
            </button>
            <span className="w-7 text-center text-xs font-semibold tabular-nums text-forest-950">
              {toBn(item.quantity)}
            </span>
            <button
              type="button"
              onClick={() => onQuantity(item.quantity + 1)}
              aria-label="Increase quantity"
              className="grid h-9 w-8 place-items-center text-forest-800 transition-colors hover:text-clay-500"
            >
              <Plus size={13} />
            </button>
          </div>

          <div className="text-right">
            <p className="font-display text-base font-bold text-forest-950 sm:text-lg">
              {formatPrice(item.price * item.quantity)}
            </p>
            {item.quantity > 1 && (
              <p className="text-[9px] text-muted">
                Each {formatPrice(item.price)}
              </p>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
