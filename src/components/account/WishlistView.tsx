"use client";

import Link from "next/link";
import { useStore } from "@/lib/store";
import { books } from "@/data/books";
import { formatPrice, toBn } from "@/lib/utils";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, ShoppingBag } from "lucide-react";

export function WishlistView() {
  const { wishlist, hydrated, addItem, notify } = useStore();
  const savedBooks = books.filter((book) => wishlist.includes(book.slug));

  if (!hydrated) {
    return (
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {[0, 1, 2, 3].map((item) => (
          <div key={item}>
            <div className="aspect-[3/4] animate-pulse rounded-2xl bg-cream-100" />
            <div className="mt-2 h-3 w-2/3 animate-pulse rounded bg-cream-100" />
          </div>
        ))}
      </div>
    );
  }

  if (savedBooks.length === 0) {
    return (
      <EmptyState
        icon={<Heart size={24} />}
        title="উইশলিস্ট এখন খালি"
        description="পছন্দের বইয়ের পাশে হার্ট আইকনে ক্লিক করে সংরক্ষণ করুন — পরে সহজে খুঁজে পাবেন।"
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/books">বই ঘুরে দেখুন</Button>
            <Button href="/best-sellers" variant="outline">
              বেস্ট সেলার
            </Button>
          </div>
        }
      />
    );
  }

  const addAll = () => {
    savedBooks.forEach((book) =>
      addItem({
        slug: book.slug,
        kind: "book",
        title: book.title,
        price: book.price,
        meta: book.author,
      }),
    );
    notify(`${toBn(savedBooks.length)}টি বই কার্টে যোগ হয়েছে`);
  };

  const total = savedBooks.reduce((sum, book) => sum + book.price, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-forest-950">
            {toBn(savedBooks.length)}টি বই সংরক্ষিত
          </p>
          <p className="mt-0.5 text-[10px] text-muted">
            মোট মূল্য {formatPrice(total)} · ফ্রি ডেলিভারি ৳৯৯৯+
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={addAll}>
            <ShoppingBag size={13} />
            সব কার্টে যোগ করুন
          </Button>
          <Button href="/books" variant="outline" size="sm">
            আরও বই
          </Button>
        </div>
      </div>
      <BookGrid books={savedBooks} columns="four" />
      <p className="mt-5 text-center text-[10px] text-muted">
        বইয়ের কার্ডে হার্ট আইকনে আবার ক্লিক করলে উইশলিস্ট থেকে সরানো যাবে।{" "}
        <Link href="/account" className="font-semibold text-clay-600">
          অ্যাকাউন্টে ফিরুন
        </Link>
      </p>
    </div>
  );
}
