"use client";

import Link from "next/link";
import {
  ArrowRight,
  Gift,
  RotateCcw,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { useStore, useHydrated } from "@/lib/store";
import { siteConfig, formatPrice, toBn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { CartLine } from "./CartLine";

const deliveryEstimate = 60;

export function CartView() {
  const {
    items,
    setQuantity,
    removeItem,
    cartTotal,
    clearCart,
  } = useStore();
  const hydrated = useHydrated();

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
        <div className="space-y-3 rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
          {[0, 1, 2].map((row) => (
            <div key={row} className="flex gap-4 py-4">
              <div className="h-24 w-16 animate-pulse rounded-lg bg-cream-200" />
              <div className="flex-1 space-y-2">
                <div className="h-3 w-2/3 animate-pulse rounded bg-cream-200" />
                <div className="h-3 w-1/3 animate-pulse rounded bg-cream-200" />
                <div className="h-8 w-24 animate-pulse rounded-full bg-cream-200" />
              </div>
            </div>
          ))}
        </div>
        <div className="h-64 animate-pulse rounded-3xl bg-cream-100" />
      </div>
    );
  }

  if (items.length === 0) {
    return (
      <EmptyState
        icon={<ShoppingBag size={24} />}
        title="Your cart is empty"
        description="Add books or Sunnah items you love to start shopping. Return a book after reading and get 50% of the purchase price back."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/books">Browse books</Button>
            <Button href="/sunnah-items" variant="outline">
              Sunnah items
            </Button>
          </div>
        }
      />
    );
  }

  const remainingForFree = Math.max(0, siteConfig.freeDeliveryThreshold - cartTotal);
  const progress = Math.min(100, (cartTotal / siteConfig.freeDeliveryThreshold) * 100);
  const delivery = remainingForFree === 0 ? 0 : deliveryEstimate;
  const total = cartTotal + delivery;

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_370px] lg:items-start">
      <div>
        <div className="rounded-2xl border border-forest-900/8 bg-cream-50">
          <div className="flex items-center justify-between gap-3 border-b border-forest-900/8 px-4 py-4 sm:px-5">
            <div className="flex items-center gap-2.5">
              <h2 className="font-display text-lg font-bold text-forest-950">
                Your cart
              </h2>
              <Badge tone="forest">{toBn(items.length)} items</Badge>
            </div>
            <button
              type="button"
              onClick={clearCart}
              className="text-[11px] font-medium text-clay-600 transition-colors hover:text-clay-500"
            >
              Clear all
            </button>
          </div>

          <div className="px-4 sm:px-5">
            {items.map((item) => (
              <CartLine
                key={`${item.kind}-${item.slug}`}
                item={item}
                onQuantity={(quantity) => setQuantity(item.slug, item.kind, quantity)}
                onRemove={() => removeItem(item.slug, item.kind)}
              />
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl border border-gold-500/20 bg-gold-500/5 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3 text-xs">
            <span className="flex items-center gap-2 font-medium text-forest-900">
              <Truck size={16} className="text-gold-600" />
              {remainingForFree > 0 ? (
                <>
                  Add <strong className="text-clay-600">{formatPrice(remainingForFree)}</strong> more for free delivery
                </>
              ) : (
                "You've unlocked free delivery!"
              )}
            </span>
            <span className="shrink-0 text-[10px] font-semibold text-forest-800">
              {formatPrice(cartTotal)} / {formatPrice(siteConfig.freeDeliveryThreshold)}
            </span>
          </div>
          <div className="mt-2.5 h-2 overflow-hidden rounded-full bg-cream-300">
            <div
              className="h-full rounded-full bg-gradient-to-r from-gold-500 to-forest-500 transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="mt-4 grid gap-2 sm:grid-cols-3">
          {[
            { icon: ShieldCheck, text: "100% original books" },
            { icon: RotateCcw, text: "50% buyback" },
            { icon: Gift, text: "Beautiful packaging" },
          ].map((item) => (
            <div
              key={item.text}
              className="flex items-center gap-2 rounded-xl border border-forest-900/8 bg-cream-50 px-3 py-2.5 text-[10px] text-forest-800"
            >
              <item.icon size={14} className="shrink-0 text-forest-600" />
              {item.text}
            </div>
          ))}
        </div>

        <Link
          href="/books"
          className="mt-5 inline-flex items-center gap-1.5 text-xs font-semibold text-forest-800 transition-colors hover:text-clay-500"
        >
          <ArrowRight size={13} className="rotate-180" />
          View more books
        </Link>
      </div>

      <aside className="lg:sticky lg:top-[88px]">
        <div className="overflow-hidden rounded-3xl border border-forest-900/10 bg-cream-50 shadow-[0_24px_60px_-46px_rgba(10,33,24,0.5)]">
          <div className="bg-forest-950 px-5 py-4 text-cream-50">
            <h2 className="font-display text-lg font-bold">Order summary</h2>
            <p className="mt-0.5 text-[10px] text-cream-100/50">
              Prices include VAT; delivery is calculated separately
            </p>
          </div>
          <div className="space-y-2.5 px-5 py-4 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted">Subtotal ({toBn(items.length)} items)</span>
              <span className="font-semibold text-forest-950">{formatPrice(cartTotal)}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Delivery</span>
              <span className="font-semibold text-forest-950">
                {delivery === 0 ? (
                  <span className="text-forest-600">Free</span>
                ) : (
                  formatPrice(delivery)
                )}
              </span>
            </div>
            <div className="border-t border-dashed border-forest-900/15 pt-3">
              <div className="flex items-end justify-between">
                <span className="text-sm font-semibold text-forest-950">Total</span>
                <span className="font-display text-2xl font-bold text-forest-950">
                  {formatPrice(total)}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 pb-5">
            <Button href="/checkout" className="w-full" size="lg">
              Proceed to checkout
              <ArrowRight size={16} />
            </Button>
            <p className="mt-3 text-center text-[9px] leading-relaxed text-muted">
              You can choose your address and payment method before confirming
              your order.
            </p>
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-forest-900/8 bg-forest-50/60 p-4">
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
            <RotateCcw size={13} className="text-forest-600" />
            Get 50% back when you return a book
          </p>
          <p className="mt-1 text-[10px] leading-relaxed text-muted">
            Return the book to us in good condition after reading and get 50% of
            the purchase price back.{" "}
            <Link href="/buyback" className="font-semibold text-clay-600">
              Learn more
            </Link>
            .
          </p>
        </div>
      </aside>
    </div>
  );
}
