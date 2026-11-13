"use client";

import Link from "next/link";
import { useStore, useHydrated } from "@/lib/store";
import { books } from "@/data/books";
import { formatPrice, toBn } from "@/lib/utils";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Heart, ShoppingBag } from "lucide-react";

export function WishlistView() {
  const { wishlist, addItem, notify } = useStore();
  const hydrated = useHydrated();
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
        title="Your wishlist is empty"
        description="Select the heart beside any book to save it here for later."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/books">Browse books</Button>
            <Button href="/best-sellers" variant="outline">
              Best sellers
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
    notify(`${toBn(savedBooks.length)} books added to cart`);
  };

  const total = savedBooks.reduce((sum, book) => sum + book.price, 0);

  return (
    <div>
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-4 py-3">
        <div>
          <p className="text-xs font-semibold text-forest-950">
            {toBn(savedBooks.length)} books saved
          </p>
          <p className="mt-0.5 text-[10px] text-muted">
            Total {formatPrice(total)} · Free delivery over ৳999
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" size="sm" onClick={addAll}>
            <ShoppingBag size={13} />
            Add all to cart
          </Button>
          <Button href="/books" variant="outline" size="sm">
            More books
          </Button>
        </div>
      </div>
      <BookGrid books={savedBooks} columns="four" />
      <p className="mt-5 text-center text-[10px] text-muted">
        Select the heart on a book card again to remove it from your wishlist.{" "}
        <Link href="/account" className="font-semibold text-clay-600">
          Back to account
        </Link>
      </p>
    </div>
  );
}
