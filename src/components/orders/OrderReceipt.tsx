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
import { formatPrice, siteConfig, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";

const steps = ["কনফার্মড", "প্রসেসিং", "ডেলিভারিতে"] as const;

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
        title="অর্ডারটি খুঁজে পাওয়া যায়নি"
        description="অর্ডারটি হয়তো এই ব্রাউজারে সংরক্ষিত নেই অথবা লিংকটি ভুল। ডেমো অর্ডারগুলো শুধু যে ব্রাউজারে কেনা হয়েছে সেখানেই দেখা যায়।"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/account/orders">আমার অর্ডার</Button>
            <Button href="/books" variant="outline">
              বই দেখুন
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
                ধন্যবাদ, আপনার অর্ডার সফল হয়েছে!
              </h1>
              <p className="mt-1 text-[11px] text-cream-100/55">
                অর্ডার নম্বর <strong className="text-gold-300">{order.id}</strong> ·{" "}
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
              প্রিন্ট / PDF
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
              অর্ডার রিসিট
            </h2>
            <p className="mt-0.5 text-[10px] text-muted">
              অর্ডার আইডি: {order.id} · {formatOrderDate(order.createdAt)}
            </p>
          </div>
          <div className="rounded-xl bg-forest-50 px-3 py-2 text-left sm:text-right">
            <p className="text-[9px] text-muted">অর্ডার স্ট্যাটাস</p>
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
            আমাদের টিম ২৪ ঘণ্টার মধ্যে কল করে ডেলিভারি নিশ্চিত করবে।
          </p>
        </div>

        <div className="px-5 py-5 sm:px-7">
          <h3 className="font-display text-sm font-bold text-forest-950">
            অর্ডার করা আইটেম
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
                        ? "অডিও বুক"
                        : item.kind === "sunnah"
                          ? "সুন্নাহ সামগ্রী"
                          : "বই"}
                      {item.meta ? ` · ${item.meta}` : ""}
                    </p>
                  </div>
                  <div className="shrink-0 text-right text-[11px]">
                    <p className="text-muted">× {toBn(item.quantity)}</p>
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
                <MapPin size={12} /> ডেলিভারি ঠিকানা
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
                <ShieldCheck size={12} /> পেমেন্ট ও ডেলিভারি
              </h4>
              <p className="mt-2 text-xs font-semibold text-forest-950">
                {paymentLabels[order.paymentMethod]}
              </p>
              <p className="text-[10px] text-muted">
                {deliveryLabels[order.deliveryMethod]}
              </p>
              {order.paymentNumber && (
                <p className="mt-1 text-[9px] text-muted">
                  পেমেন্ট নম্বর: {order.paymentNumber}
                </p>
              )}
              {order.note && (
                <p className="mt-2 rounded-lg bg-cream-50 px-2.5 py-2 text-[9px] leading-relaxed text-muted">
                  নির্দেশনা: {order.note}
                </p>
              )}
            </div>
          </div>

          <div className="mt-4 ml-auto max-w-sm space-y-2 text-[11px]">
            <div className="flex items-center justify-between">
              <span className="text-muted">সাবটোটাল</span>
              <span className="font-semibold text-forest-950">
                {formatPrice(order.subtotal)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">ডেলিভারি চার্জ</span>
              <span className="font-semibold text-forest-950">
                {order.deliveryCharge === 0 ? "ফ্রি" : formatPrice(order.deliveryCharge)}
              </span>
            </div>
            <div className="flex items-center justify-between border-t border-dashed border-forest-900/15 pt-2">
              <span className="text-sm font-semibold text-forest-950">সর্বমোট</span>
              <span className="font-display text-xl font-bold text-forest-950">
                {formatPrice(order.total)}
              </span>
            </div>
          </div>
        </div>

        <div className="border-t border-forest-900/8 bg-cream-100/40 px-5 py-4 text-[9px] leading-relaxed text-muted sm:px-7">
          <p className="font-semibold text-forest-800">ডেমো রিসিট</p>
          <p className="mt-0.5">
            এটি একটি ফ্রন্টএন্ড ডেমো অর্ডার। কোনো আসল পেমেন্ট নেওয়া হয়নি এবং
            অর্ডারটি শুধু আপনার ব্রাউজারে সংরক্ষিত আছে। বই হাতে পাওয়ার ৭ দিনের
            মধ্যে রিটার্ন বা এক্সচেঞ্জের জন্য যোগাযোগ করতে পারবেন।
          </p>
          <p className="mt-1.5">
            সহায়তা: {siteConfig.phone} · {siteConfig.email} · {siteConfig.address}
          </p>
        </div>
      </div>

      <div className="print-hide mt-5 grid gap-3 sm:grid-cols-2">
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <Headphones size={14} className="text-forest-600" />
              অডিও বুক কিনেছেন?
            </p>
            <p className="mt-0.5 text-[9px] text-muted">
              অডিও বুকটি আপনার লাইব্রেরিতে স্বয়ংক্রিয়ভাবে আনলক হয়েছে।
            </p>
          </div>
          <Button href="/audio-books" variant="outline" size="sm">
            শুনুন
            <ArrowRight size={13} />
          </Button>
        </div>
        <div className="flex flex-col justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:flex-row sm:items-center">
          <div>
            <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <Phone size={14} className="text-forest-600" />
              অর্ডার নিয়ে সহায়তা
            </p>
            <p className="mt-0.5 text-[9px] text-muted">
              অর্ডার নম্বরটি বলুন — আমাদের টিম দ্রুত সহায়তা করবে।
            </p>
          </div>
          <Button href="/contact" variant="outline" size="sm">
            যোগাযোগ
          </Button>
        </div>
      </div>

      <div className="print-hide mt-4 flex flex-wrap items-center justify-center gap-3">
        <Button href="/account/orders" variant="ghost" size="sm">
          আমার সব অর্ডার
        </Button>
        <Button href="/books" variant="primary" size="sm">
          আরও বই কিনুন
        </Button>
        <Link
          href={siteConfig.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-800 hover:text-clay-500"
        >
          <Download size={13} />
          হোয়াটসঅ্যাপে রিসিট নিন
        </Link>
      </div>
    </div>
  );
}
