"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Check,
  Gift,
  Minus,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Truck,
  Zap,
} from "lucide-react";
import type { SunnahItem } from "@/lib/types";
import { useStore } from "@/lib/store";
import { cn, discountPercent, formatPrice, toBn } from "@/lib/utils";

export function SunnahPurchasePanel({ item }: { item: SunnahItem }) {
  const router = useRouter();
  const { addItem } = useStore();
  const [quantity, setQuantity] = useState(1);
  const lowStock = item.stock <= 6;
  const discount = discountPercent(item.price, item.oldPrice);

  const payload = {
    slug: item.slug,
    kind: "sunnah" as const,
    title: item.name,
    price: item.price,
    meta: item.subtitle,
  };

  return (
    <div>
      <div className="flex flex-wrap items-end gap-3">
        <span className="font-display text-3xl font-bold text-forest-950 sm:text-4xl">
          {formatPrice(item.price)}
        </span>
        {item.oldPrice && (
          <>
            <span className="pb-1 text-sm text-muted line-through">
              {formatPrice(item.oldPrice)}
            </span>
            {discount && (
              <span className="mb-1 rounded-full bg-clay-500/10 px-2.5 py-1 text-[10px] font-semibold text-clay-600">
                {toBn(discount)}% off
              </span>
            )}
          </>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-3 text-[11px] text-muted">
        <span className="inline-flex items-center gap-1.5">
          <Check size={13} className="text-forest-600" />
          Instant order confirmation
        </span>
        <span aria-hidden="true">·</span>
        <span>Cash on delivery available</span>
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-2.5 rounded-[14px] border border-forest-900/10 bg-cream-50 p-2 sm:gap-3 sm:p-2.5">
        <div className="inline-flex h-11 items-center rounded-full border border-forest-900/12 bg-white">
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.max(1, value - 1))}
            aria-label="Decrease quantity"
            className="grid h-11 w-10 place-items-center text-forest-800 transition-colors hover:text-sale"
          >
            <Minus size={15} />
          </button>
          <span className="w-8 text-center text-sm font-semibold text-forest-950">
            {toBn(quantity)}
          </span>
          <button
            type="button"
            onClick={() => setQuantity((value) => Math.min(item.stock, value + 1))}
            aria-label="Increase quantity"
            className="grid h-11 w-10 place-items-center text-forest-800 transition-colors hover:text-sale"
          >
            <Plus size={15} />
          </button>
        </div>

        <span
          className={cn(
            "ml-auto inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-medium",
            lowStock
              ? "bg-gold-500/15 text-gold-600"
              : "bg-forest-50 text-forest-700",
          )}
        >
          <ShieldCheck size={13} />
          {lowStock
            ? `Only ${toBn(item.stock)} left`
            : `In stock · ${toBn(item.stock)} available`}
        </span>
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <button
          type="button"
          onClick={() => addItem(payload, quantity)}
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-forest-900 px-3 text-[13px] font-semibold text-cream-50 transition-colors hover:bg-forest-700 sm:px-6 sm:text-sm"
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
          className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-500 px-3 text-[13px] font-semibold text-forest-950 transition-colors hover:bg-gold-400 sm:px-6 sm:text-sm"
        >
          <Zap size={16} />
          Buy now
        </button>
      </div>

      <div className="mt-5 grid gap-2 sm:grid-cols-3">
        <div className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800">
          <Truck size={15} className="shrink-0 text-forest-600" />
          Free delivery over ৳999
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800">
          <Gift size={15} className="shrink-0 text-gold-600" />
          Gift packing available
        </div>
        <div className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800">
          <ShieldCheck size={15} className="shrink-0 text-forest-600" />
          Checked before packing
        </div>
      </div>
    </div>
  );
}
