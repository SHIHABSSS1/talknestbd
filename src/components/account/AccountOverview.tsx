"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowUpRight,
  Headphones,
  Heart,
  MapPin,
  Package,
  Plus,
  Settings,
  ShoppingBag,
} from "lucide-react";
import { books } from "@/data/books";
import { useStore } from "@/lib/store";
import {
  formatOrderDate,
  readAddresses,
  readOrders,
  readProfile,
  type Order,
  type Profile,
  type SavedAddress,
} from "@/lib/orders";
import { freeAudioSlugs, readUnlockedAudio } from "@/lib/audio";
import { formatPrice, initials, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AccountOverview() {
  const { wishlist, hydrated } = useStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [audioCount, setAudioCount] = useState(0);

  useEffect(() => {
    setProfile(readProfile());
    setOrders(readOrders());
    setAddresses(readAddresses());
    setAudioCount(new Set([...freeAudioSlugs, ...readUnlockedAudio()]).size);
  }, []);

  if (!hydrated || !profile) {
    return (
      <div className="space-y-4">
        <div className="h-40 animate-pulse rounded-3xl bg-cream-100" />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[0, 1, 2, 3].map((item) => (
            <div key={item} className="h-24 animate-pulse rounded-2xl bg-cream-100" />
          ))}
        </div>
        <div className="h-56 animate-pulse rounded-3xl bg-cream-100" />
      </div>
    );
  }

  const wishlistBooks = books.filter((book) => wishlist.includes(book.slug));

  const stats = [
    {
      label: "মোট অর্ডার",
      value: toBn(orders.length),
      icon: Package,
      href: "/account/orders",
      tint: "bg-forest-100 text-forest-700",
    },
    {
      label: "উইশলিস্টে",
      value: toBn(wishlistBooks.length),
      icon: Heart,
      href: "/wishlist",
      tint: "bg-clay-500/10 text-clay-600",
    },
    {
      label: "সংরক্ষিত ঠিকানা",
      value: toBn(addresses.length),
      icon: MapPin,
      href: "/account/addresses",
      tint: "bg-gold-500/15 text-gold-600",
    },
    {
      label: "আমার অডিও",
      value: toBn(audioCount),
      icon: Headphones,
      href: "/audio-books",
      tint: "bg-forest-900/10 text-forest-800",
    },
  ];

  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-3xl bg-forest-950 p-5 text-cream-50 sm:p-6">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-[0.1]" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 h-48 w-48 rounded-full border border-gold-400/15"
        />
        <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
          <div className="flex items-center gap-4">
            <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gold-500 font-display text-lg font-bold text-forest-950">
              {initials(profile.name)}
            </span>
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                শুভ দিন, পাঠক
              </p>
              <h1 className="mt-1 font-display text-2xl font-bold">{profile.name}</h1>
              <p className="mt-0.5 text-[10px] text-cream-100/50">
                {profile.email} · {profile.phone}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button href="/account/settings" variant="light" size="sm">
              <Settings size={13} />
              প্রোফাইল সেটিংস
            </Button>
            <Button href="/books" variant="gold" size="sm">
              <Plus size={13} />
              নতুন বই
            </Button>
          </div>
        </div>
      </section>

      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="group flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 transition-colors hover:border-forest-900/20"
          >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${stat.tint}`}>
              <stat.icon size={17} />
            </span>
            <span>
              <span className="block font-display text-xl font-bold text-forest-950">
                {stat.value}
              </span>
              <span className="block text-[9px] text-muted">{stat.label}</span>
            </span>
            <ArrowUpRight
              size={13}
              className="ml-auto text-forest-900/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
            />
          </Link>
        ))}
      </div>

      <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
        <div className="flex items-center justify-between gap-3">
          <h2 className="font-display text-lg font-bold text-forest-950">সাম্প্রতিক অর্ডার</h2>
          <Link
            href="/account/orders"
            className="inline-flex items-center gap-1 text-[10px] font-semibold text-clay-600 hover:text-clay-500"
          >
            সব দেখুন <ArrowUpRight size={12} />
          </Link>
        </div>

        {orders.length > 0 ? (
          <div className="mt-3 space-y-2">
            {orders.slice(0, 2).map((order) => (
              <Link
                key={order.id}
                href={`/orders/${order.id}`}
                className="flex flex-wrap items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/40 p-3.5 transition-colors hover:bg-cream-100"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest-900 text-gold-300">
                  <ShoppingBag size={16} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-semibold text-forest-950">{order.id}</span>
                    <Badge tone="forest">{order.status}</Badge>
                  </span>
                  <span className="mt-0.5 block text-[9px] text-muted">
                    {formatOrderDate(order.createdAt)} · {toBn(order.items.length)}টি আইটেম
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-xs font-bold text-forest-950">
                    {formatPrice(order.total)}
                  </span>
                  <span className="block text-[9px] text-clay-600">রিসিট দেখুন →</span>
                </span>
              </Link>
            ))}
          </div>
        ) : (
          <div className="mt-3 flex flex-col items-start justify-between gap-3 rounded-2xl border border-dashed border-forest-900/15 bg-cream-100/40 p-5 sm:flex-row sm:items-center">
            <div>
              <p className="text-xs font-semibold text-forest-900">এখনো কোনো অর্ডার নেই</p>
              <p className="mt-0.5 text-[10px] text-muted">
                পছন্দের বই যোগ করে প্রথম অর্ডারটি সম্পন্ন করুন।
              </p>
            </div>
            <Button href="/books" size="sm">
              বই দেখুন
            </Button>
          </div>
        )}
      </section>

      <div className="grid gap-4 sm:grid-cols-2">
        <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-forest-950">উইশলিস্ট</h2>
            <Link href="/wishlist" className="text-[10px] font-semibold text-clay-600">
              সব দেখুন
            </Link>
          </div>
          {wishlistBooks.length > 0 ? (
            <div className="mt-3 grid grid-cols-4 gap-2">
              {wishlistBooks.slice(0, 4).map((book) => (
                <Link key={book.slug} href={`/books/${book.slug}`} className="group">
                  <span className="block aspect-[3/4] overflow-hidden rounded-md bg-cream-100">
                    <BookCover book={book} size="sm" />
                  </span>
                  <span className="mt-1 block line-clamp-1 text-[9px] font-medium text-forest-900 group-hover:text-clay-500">
                    {book.title}
                  </span>
                </Link>
              ))}
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-forest-900/15 p-4 text-center">
              <Heart size={17} className="mx-auto text-forest-900/25" />
              <p className="mt-1.5 text-[10px] text-muted">পছন্দের বই হার্ট আইকনে সংরক্ষণ করুন।</p>
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
          <div className="flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-forest-950">সংরক্ষিত ঠিকানা</h2>
            <Link href="/account/addresses" className="text-[10px] font-semibold text-clay-600">
              ম্যানেজ করুন
            </Link>
          </div>
          {addresses[0] ? (
            <div className="mt-3 rounded-2xl bg-cream-100/60 p-3.5">
              <p className="flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-wider text-forest-700">
                <MapPin size={11} />
                {addresses[0].label}
                {addresses[0].isDefault && <Badge tone="gold">ডিফল্ট</Badge>}
              </p>
              <p className="mt-1.5 text-xs font-semibold text-forest-950">{addresses[0].name}</p>
              <p className="text-[9px] text-muted">{addresses[0].phone}</p>
              <p className="mt-0.5 line-clamp-2 text-[9px] leading-relaxed text-muted">
                {addresses[0].street}, {addresses[0].area}, {addresses[0].district}
              </p>
            </div>
          ) : (
            <div className="mt-3 rounded-2xl border border-dashed border-forest-900/15 p-4 text-center">
              <MapPin size={17} className="mx-auto text-forest-900/25" />
              <p className="mt-1.5 text-[10px] text-muted">চেকআউটের সময় ঠিকানা সংরক্ষণ করুন।</p>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
