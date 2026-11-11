"use client";

import Link from "next/link";
import { Check, Truck } from "lucide-react";
import type { CartItem } from "@/lib/store";
import { books } from "@/data/books";
import { sunnahItems } from "@/data/sunnah";
import {
  deliveryLabels,
  paymentLabels,
  type DeliveryMethod,
  type PaymentMethod,
} from "@/lib/orders";
import { formatPrice, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";

export function CheckoutSummary({
  items,
  subtotal,
  deliveryCharge,
  total,
  deliveryMethod,
  paymentMethod,
}: {
  items: CartItem[];
  subtotal: number;
  deliveryCharge: number;
  total: number;
  deliveryMethod: DeliveryMethod;
  paymentMethod: PaymentMethod;
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-forest-900/10 bg-cream-50">
      <div className="border-b border-forest-900/8 bg-cream-100/60 px-5 py-4">
        <h2 className="font-display text-lg font-bold text-forest-950">অর্ডার সারাংশ</h2>
        <p className="mt-0.5 text-[10px] text-muted">
          {toBn(items.length)}টি আইটেম · ডেলিভারি চার্জসহ
        </p>
      </div>

      <div className="max-h-[280px] overflow-y-auto px-5 py-3">
        {items.map((item) => {
          const book = item.kind !== "sunnah" ? books.find((entry) => entry.slug === item.slug) : undefined;
          const sunnah = item.kind === "sunnah" ? sunnahItems.find((entry) => entry.slug === item.slug) : undefined;
          return (
            <div
              key={`${item.kind}-${item.slug}`}
              className="flex items-center gap-3 border-b border-forest-900/6 py-2.5 last:border-b-0"
            >
              <Link
                href={
                  item.kind === "audio"
                    ? "/audio-books"
                    : book
                      ? `/books/${book.slug}`
                      : "/sunnah-items"
                }
                className="relative block h-14 w-10 shrink-0 overflow-hidden rounded bg-cream-100"
              >
                {book ? (
                  <BookCover book={book} size="sm" />
                ) : (
                  <span
                    className="grid h-full w-full place-items-center px-0.5 text-center text-[7px] font-semibold leading-tight"
                    style={{ color: sunnah?.accent ?? "#1b5b45" }}
                  >
                    {item.title}
                  </span>
                )}
              </Link>
              <div className="min-w-0 flex-1">
                <p className="line-clamp-1 text-[11px] font-semibold text-forest-950">
                  {item.title}
                </p>
                <p className="text-[9px] text-muted">পরিমাণ: {toBn(item.quantity)}</p>
              </div>
              <span className="shrink-0 text-[11px] font-semibold text-forest-900">
                {formatPrice(item.price * item.quantity)}
              </span>
            </div>
          );
        })}
      </div>

      <div className="space-y-2 border-t border-forest-900/8 px-5 py-4 text-[11px]">
        <div className="flex items-center justify-between">
          <span className="text-muted">সাবটোটাল</span>
          <span className="font-semibold text-forest-950">{formatPrice(subtotal)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">
            ডেলিভারি <span className="text-[9px]">({deliveryLabels[deliveryMethod]})</span>
          </span>
          <span className="font-semibold text-forest-950">
            {deliveryCharge === 0 ? (
              <span className="inline-flex items-center gap-1 text-forest-600">
                <Check size={11} /> ফ্রি
              </span>
            ) : (
              formatPrice(deliveryCharge)
            )}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted">পেমেন্ট</span>
          <span className="font-semibold text-forest-950">
            {paymentLabels[paymentMethod]}
          </span>
        </div>
        <div className="flex items-end justify-between border-t border-dashed border-forest-900/15 pt-3">
          <span className="text-sm font-semibold text-forest-950">সর্বমোট</span>
          <span className="font-display text-2xl font-bold text-forest-950">
            {formatPrice(total)}
          </span>
        </div>
      </div>

      <div className="flex items-start gap-2 border-t border-forest-900/8 bg-forest-50/60 px-5 py-3 text-[9px] leading-relaxed text-forest-800/70">
        <Truck size={14} className="mt-0.5 shrink-0 text-forest-600" />
        অর্ডার কনফার্ম হলে ২৪ ঘণ্টার মধ্যে আমাদের টিম আপনাকে কল করে
        ডেলিভারি নিশ্চিত করবে।
      </div>
    </div>
  );
}
