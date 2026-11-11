"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Package,
  RotateCcw,
  ShoppingBag,
} from "lucide-react";
import {
  formatOrderDate,
  readOrders,
  type Order,
} from "@/lib/orders";
import { books } from "@/data/books";
import { sunnahItems } from "@/data/sunnah";
import { useStore } from "@/lib/store";
import { formatPrice, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";

export function AccountOrders() {
  const { addItem, notify } = useStore();
  const [orders, setOrders] = useState<Order[] | null>(null);

  useEffect(() => {
    setOrders(readOrders());
  }, []);

  if (orders === null) {
    return (
      <div className="space-y-3">
        {[0, 1].map((item) => (
          <div key={item} className="h-44 animate-pulse rounded-3xl bg-cream-100" />
        ))}
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <EmptyState
        icon={<Package size={24} />}
        title="এখনো কোনো অর্ডার করেননি"
        description="বই বা সুন্নাহ সামগ্রী অর্ডার করলে সেগুলোর রিসিট ও স্ট্যাটাস এখানে দেখা যাবে।"
        action={<Button href="/books">বই ঘুরে দেখুন</Button>}
      />
    );
  }

  const reorder = (order: Order) => {
    order.items.forEach((item) => {
      addItem(
        {
          slug: item.slug,
          kind: item.kind,
          title: item.title,
          price: item.price,
          meta: item.meta,
        },
        item.quantity,
      );
    });
    notify("আগের অর্ডারের আইটেম কার্টে যোগ হয়েছে");
  };

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="font-display text-xl font-bold text-forest-950">আমার অর্ডার</h1>
        <Badge tone="forest">মোট {toBn(orders.length)}টি অর্ডার</Badge>
      </div>

      {orders.map((order) => (
        <article
          key={order.id}
          className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50"
        >
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-forest-900/8 bg-cream-100/40 px-4 py-3.5 sm:px-5">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-xs font-bold text-forest-950">{order.id}</p>
                <Badge tone={order.status === "কনফার্মড" ? "gold" : "forest"}>
                  {order.status}
                </Badge>
              </div>
              <p className="mt-0.5 text-[9px] text-muted">{formatOrderDate(order.createdAt)}</p>
            </div>
            <div className="text-right">
              <p className="text-[9px] text-muted">সর্বমোট</p>
              <p className="font-display text-lg font-bold text-forest-950">
                {formatPrice(order.total)}
              </p>
            </div>
          </div>

          <div className="px-4 py-4 sm:px-5">
            <div className="space-y-2.5">
              {order.items.slice(0, 3).map((item) => {
                const book =
                  item.kind !== "sunnah"
                    ? books.find((entry) => entry.slug === item.slug)
                    : undefined;
                const sunnah =
                  item.kind === "sunnah"
                    ? sunnahItems.find((entry) => entry.slug === item.slug)
                    : undefined;
                return (
                  <div key={`${item.kind}-${item.slug}`} className="flex items-center gap-2.5">
                    <span className="h-12 w-8 shrink-0 overflow-hidden rounded bg-cream-100">
                      {book ? (
                        <BookCover book={book} size="sm" />
                      ) : (
                        <span
                          className="grid h-full w-full place-items-center text-center text-[6px] font-semibold"
                          style={{ color: sunnah?.accent ?? "#1b5b45" }}
                        >
                          {item.title}
                        </span>
                      )}
                    </span>
                    <div className="min-w-0 flex-1">
                      <p className="line-clamp-1 text-[11px] font-medium text-forest-900">
                        {item.title}
                      </p>
                      <p className="text-[9px] text-muted">
                        {item.kind === "audio" ? "অডিও বুক" : item.kind === "sunnah" ? "সুন্নাহ" : "বই"} ·{" "}
                        {toBn(item.quantity)}টি
                      </p>
                    </div>
                    <span className="shrink-0 text-[10px] font-semibold text-forest-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                );
              })}
              {order.items.length > 3 && (
                <p className="text-[9px] text-muted">
                  আরও {toBn(order.items.length - 3)}টি আইটেম...
                </p>
              )}
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
              <p className="text-[9px] text-muted">
                ডেলিভারি: {formatPrice(order.deliveryCharge)}{" "}
                {order.deliveryCharge === 0 && <span className="text-forest-600">(ফ্রি)</span>}
              </p>
              <div className="flex flex-wrap gap-2">
                <Button type="button" variant="outline" size="sm" onClick={() => reorder(order)}>
                  <RotateCcw size={12} />
                  আবার কিনুন
                </Button>
                <Link
                  href={`/orders/${order.id}`}
                  className="inline-flex h-9 items-center gap-1.5 rounded-full bg-forest-900 px-4 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
                >
                  <ShoppingBag size={12} />
                  রিসিট দেখুন
                  <ArrowUpRight size={12} />
                </Link>
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
