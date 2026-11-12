"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  CheckCircle2,
  Clock3,
  Download,
  Headphones,
  MapPin,
  PackageCheck,
  Phone,
  Printer,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import {
  deliveryLabels,
  formatOrderDate,
  paymentLabels,
  readOrder,
  type Order,
} from "@/lib/orders";
import { books } from "@/data/books";
import { sunnahItems } from "@/data/sunnah";
import { formatCount, formatPrice, siteConfig } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const steps = ["Confirmed", "Processing", "Out for delivery"] as const;

export function OrderReceipt({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null | undefined>(undefined);

  useEffect(() => {
    setOrder(readOrder(orderId) ?? null);
  }, [orderId]);

  if (order === undefined) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-cream-100" />
        <div className="h-72 animate-pulse rounded-3xl bg-cream-100" />
      </div>
    );
  }

  if (order === null) {
    return (
      <EmptyState
        icon={<ShoppingBag size={24} />}
        title="Order not found"
        description="This order may not be saved in this browser, or the link may be incorrect. Demo orders are available only in the browser where they were placed."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/account/orders">My orders</Button>
            <Button href="/books" variant="outline">
              Browse books
            </Button>
          </div>
        }
      />
    );
  }

  const currentStep = steps.findIndex((step) => step === order.status);

  return (
    <div>
      <div className="print-hide mb-5 overflow-hidden rounded-3xl bg-forest-950 px-5 py-6 text-cream-50 sm:px-7">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div className="flex items-start gap-3.5">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest-500/25 text-forest-200">
              <CheckCircle2 size={24} />
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                Order Confirmed
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold sm:text-3xl">
                 Thank you, your order is confirmed!
              </h1>
              <p className="mt-1 text-[11px] text-cream-100/55">
                 Order number <strong className="text-gold-300">{order.id}</strong> ·{" "}
                {formatOrderDate(order.createdAt)}
              </p>
            </div>
          </div>
          <div className="flex shrink-0 gap-2">
            <button
              type="button"
              onClick={() => window.print()}
              className="inline-flex h-10 items-center gap-2 rounded-full border border-white/15 px-4 text-[11px] font-semibold text-cream-100 transition-colors hover:border-gold-400 hover:text-gold-300"
            >
              <Printer size={14} />
               Print / PDF
            </button>
          </div>
        </div>
      </div>

      <div className="print-receipt overflow-hidden rounded-3xl border border-forest-900/10 bg-cream-50">
        <div className="flex flex-col gap-3 border-b border-forest-900/8 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-clay-500">
              TalkNest BD · Order Receipt
            </p>
            <h2 className="mt-1 font-display text-xl font-bold text-forest-950">
               Order receipt
            </h2>
            <p className="mt-0.5 text-[10px] text-muted">
               Order ID: {order.id} · {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="rounded-xl bg-forest-50 px-3 py-2 text-left sm:text-right">
             <p className="text-[9px] text-muted">Order status</p>
            <p className="text-xs font-semibold text-forest-800">{order.status}</p>
          </div>
        </div>

        <div className="border-b border-forest-900/8 px-5 py-5 sm:px-7">
          <div className="flex items-center gap-0">
            {steps.map((step, index) => {
              const done = index <= currentStep;
              return (
                <div key={step} className="flex flex-1 items-center last:flex-none">
                  <div className="flex flex-col items-center gap-1.5">
                    <span
                      className={
                        done
                          ? "grid h-8 w-8 place-items-center rounded-full bg-forest-800 text-cream-50"
                          : "grid h-8 w-8 place-items-center rounded-full border border-forest-900/15 bg-cream-100 text-muted"
                      }
                    >
                      {index === 0 ? (
                        <CheckCircle2 size={15} />
                      ) : index === 1 ? (
                        <PackageCheck size={15} />
                      ) : (
                        <Truck size={15} />
                      )}
                    </span>
                    <span
                      className={
                        done
                          ? "text-[9px] font-semibold text-forest-900"
                          : "text-[9px] text-muted"
                      }
                    >
                      {step}
                    </span>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="mx-2 mb-4 h-0.5 flex-1 rounded-full bg-cream-300">
                      <div
                        className="h-full rounded-full bg-forest-600"
                        style={{ width: index < currentStep ? "100%" : "0%" }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
          <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">
            <Clock3 size={12} />
             Our team will call within 24 hours to confirm delivery.
          </p>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <h3 className="font-display text-sm font-bold text-forest-950">
             Ordered items
          </h3>
          <div className="mt-3">
            {order.items.map((item) => {
              const book =
                item.kind !== "sunnah"
                  ? books.find((entry) => entry.slug === item.slug)
                  : undefined;
              const sunnah =
                item.kind === "sunnah"
                  ? sunnahItems.find((entry) => entry.slug === item.slug)
                  : undefined;
              return (
                <div
                  key={`${item.kind}-${item.slug}`}
                  className="flex items-center gap-3 border-b border-forest-900/6 py-3 last:border-b-0"
                >
                  <div className="h-16 w-11 shrink-0 overflow-hidden rounded bg-cream-100">
                    {book ? (
                      <BookCover book={book} size="sm" />
                    ) : (
                      <span
                        className="grid h-full w-full place-items-center px-1 text-center text-[8px] font-semibold"
                        style={{ color: sunnah?.accent ?? "#1b5b45" }}
                      >
                        {item.title}
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-1 text-xs font-semibold text-forest-950">
                      {item.title}
                    </p>
                    <p className="text-[9px] text-muted">
                      {item.kind === "audio"
                        ? "Audiobook"
                        : item.kind === "sunnah"
                          ? "Sunnah essential"
                          : "Book"}
                      {item.meta ? ` · ${item.meta}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-[11px]">
                     <p className="text-muted">× {formatCount(item.quantity)}</p>
                    <p className="font-semibold text-forest-900">
                      {formatPrice(item.price * item.quantity)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl bg-cream-100/60 p-4">
              <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-800">
                 <MapPin size={12} /> Delivery address
              </h4>
              <p className="mt-2 text-xs font-semibold text-forest-950">
                {order.address.name}
              </p>
              <p className="text-[10px] text-muted">{order.address.phone}</p>
              <p className="mt-1 text-[10px] leading-relaxed text-muted">
                {order.address.street}, {order.address.area}, {order.address.district},
                {" "}{order.address.division}
                {order.address.postcode ? ` - ${order.address.postcode}` : ""}
              </p>
              {order.address.email && (
                <p className="mt-1 text-[9px] text-muted">{order.address.email}</p>
              )}
            </div>
            <div className="rounded-2xl bg-cream-100/60 p-4">
              <h4 className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.12em] text-forest-800">
                 <ShieldCheck size={12} /> Payment and delivery
              </h4>
              <p className="mt-2 text-xs font-semibold text-forest-950">
                {paymentLabels[order.paymentMethod]}
              </p>
              <p className="text-[10px] text-muted">
                {deliveryLabels[order.deliveryMethod]}
              </p>
              {order.paymentNumber && (
                <p className="mt-1 text-[9px] text-muted">
                   Payment number: {order.paymentNumber}
                </p>
              )}
              {order.note && (
                <p className="mt-2 rounded-lg bg-cream-50 px-2.5 py-2 text-[9px] leading-relaxed text-muted">
                   Note: {order.note}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 ml-auto max-w-sm space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
               <span className="text-muted">Subtotal</span>
              <span className="font-semibold text-forest-950">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
               <span className="text-muted">Delivery charge</span>
              <span className="font-semibold text-forest-950">
                 {order.deliveryCharge === 0 ? "Free" : formatPrice(order.deliveryCharge)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-forest-900/15 pt-2">
               <span className="text-sm font-semibold text-forest-950">Total</span>
              <span className="font-display text-xl font-bold text-forest-950">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-900/8 bg-cream-100/40 px-5 py-4 text-[9px] leading-relaxed text-muted sm:px-7">
           <p className="font-semibold text-forest-800">Demo receipt</p>
          <p className="mt-0.5">
             This is a front-end demo order. No real payment was taken, and the
             order is saved only in your browser. For a live order, you could
             contact us within seven days of delivery for a return or exchange.
          </p>
          <p className="mt-1.5">
             Support: {siteConfig.phone} · {siteConfig.email} · {siteConfig.address}
          </p>
        </div>
      </div>

      <div className="print-hide mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <Headphones size={14} className="text-forest-600" />
               Bought an audiobook?
            </p>
            <p className="mt-0.5 text-[9px] text-muted">
               It has been unlocked automatically in your audio library.
            </p>
          </div>
          <Button href="/audio-books" variant="outline" size="sm">
             Listen now
            <ArrowRight size={13} />
          </Button>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <Phone size={14} className="text-forest-600" />
               Help with your order
            </p>
            <p className="mt-0.5 text-[9px] text-muted">
               Share the order number and our team will help quickly.
            </p>
          </div>
          <Button href="/contact" variant="outline" size="sm">
             Contact us
          </Button>
        </div>
      </div>

      <div className="print-hide mt-4 flex flex-wrap items-center justify-center gap-3">
        <Button href="/account/orders" variant="ghost" size="sm">
           All my orders
        </Button>
        <Button href="/books" variant="primary" size="sm">
           Buy more books
        </Button>
        <Link
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-800 hover:text-clay-500"
        >
          <Download size={13} />
           Get the receipt on WhatsApp
        </Link>
      </div>
    </div>
  );
}
