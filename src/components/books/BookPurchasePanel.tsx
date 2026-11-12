"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Heart,
  Minus,
  Plus,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import type { Book } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn, formatPrice, toBn } from "@/lib/utils";

export function BookPurchasePanel({ book }: { book: Book }) {
  const router = useRouter();
  const { addItem, toggleWishlist, isWishlisted, hydrated } = useStore();
  const [quantity, setQuantity] = useState(1);
  const wished = hydrated && isWishlisted(book.slug);

  const payload = {
    slug: book.slug,
    kind: "book" as const,
    title: book.title,
    price: book.price,
    meta: book.author,
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <span className="font-display text-3xl font-bold text-forest-950 sm:text-4xl">
          {formatPrice(book.price)}
        </span>
        {book.oldPrice && (
          <>
            <span className="pb-1 text-sm text-muted line-through">
              {formatPrice(book.oldPrice)}
            </span>
            <span className="mb-1 rounded-full bg-clay-500/10 px-2.5 py-1 text-[10px] font-semibold text-clay-600">
              {toBn(Math.round(((book.oldPrice - book.price) / book.oldPrice) * 100))}% off
            </span>
          </>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px]">
        <span className="inline-flex items-center gap-1.5 font-medium text-forest-600">
          <Check size={13} />
          In stock ({toBn(book.stock)} copies)
        </span>
        <span className="text-muted">·</span>
        <span className="text-muted">Instant order confirmation</span>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <div className="inline-flex h-12 items-center rounded-full border border-forest-900/15 bg-cream-50">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            className="grid h-12 w-10 place-items-center text-forest-800 transition-colors hover:text-clay-500"
          >
            <Minus size={15} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-forest-950">
            {toBn(quantity)}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(book.stock, value + 1))}
            aria-label="Increase quantity"
            className="grid h-12 w-10 place-items-center text-forest-800 transition-colors hover:text-clay-500"
          >
            <Plus size={15} />
          </button>
        </div>

        <button
          type="button"
          onClick={() => addItem(payload, quantity)}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-forest-900 px-5 text-sm font-semibold text-cream-50 transition-colors hover:bg-forest-700 sm:flex-none"
        >
          <ShoppingBag size={17} />
          Add to cart
        </button>

        <button
          type="button"
          onClick={() => {
            addItem(payload, quantity);
            router.push("/checkout");
          }}
          className="inline-flex h-12 flex-1 items-center justify-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400 sm:flex-none"
        >
          Buy now
        </button>

        <button
          type="button"
          onClick={() => toggleWishlist(book.slug)}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          aria-pressed={wished}
          className={cn(
            "grid h-12 w-12 place-items-center rounded-full border transition-colors",
            wished
              ? "border-clay-500/30 bg-clay-500/10 text-clay-500"
              : "border-forest-900/15 bg-cream-50 text-forest-800 hover:border-clay-500/30 hover:text-clay-500",
          )}
        >
          <Heart size={18} className={wished ? "fill-clay-500" : ""} />
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800">
          <Truck size={15} className="shrink-0 text-forest-600" />
          ৳999+ orders ship free
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800">
          <RotateCcw size={15} className="shrink-0 text-clay-500" />
          50% back after you read
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800">
          <ShieldCheck size={15} className="shrink-0 text-forest-600" />
          100% original books
        </div>
      </div>
    </div>
  );
}
