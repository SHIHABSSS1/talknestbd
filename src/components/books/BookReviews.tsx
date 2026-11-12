"use client";

import Link from "next/link";
import { ArrowUpRight, PenLine, Star, ThumbsUp } from "lucide-react";
import type { Book } from "@/lib/types";
import { reviews, ratingBreakdown } from "@/data/reviews";
import { toBn } from "@/lib/utils";

export function BookReviews({ book }: { book: Book }) {
  const bookReviews = reviews.filter((review) => review.bookSlug === book.slug);
  const total = ratingBreakdown.reduce((sum, row) => sum + row.count, 0);

  return (
    <section id="book-reviews" className="scroll-mt-32">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
            <span className="h-px w-5 bg-clay-500/50" />
            Reader Reviews
          </span>
          <h2 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
            Reader reviews
          </h2>
        </div>
        <Link
          href="/reviews"
          className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/15 px-4 py-2 text-[11px] font-semibold text-forest-800 transition-colors hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50"
        >
          All reviews
          <ArrowUpRight size={13} />
        </Link>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[300px_1fr]">
        <div className="rounded-2xl border border-forest-900/8 bg-cream-100/60 p-5">
          <div className="flex items-center gap-3">
            <p className="font-display text-4xl font-bold text-forest-950">
              {toBn(book.rating)}
            </p>
            <div>
              <div className="flex gap-0.5 text-gold-500">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star
                    key={star}
                    size={13}
                    className={star < Math.round(book.rating) ? "fill-gold-500" : "text-cream-300"}
                  />
                ))}
              </div>
              <p className="mt-1 text-[10px] text-muted">
                {toBn(book.reviewCount)} verified reviews
              </p>
            </div>
          </div>

          <div className="mt-4 space-y-1.5">
            {ratingBreakdown.map((row) => (
              <div key={row.stars} className="flex items-center gap-2 text-[9px] text-muted">
                <span className="w-2">{toBn(row.stars)}</span>
                <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300">
                  <div
                    className="h-full rounded-full bg-gold-500"
                    style={{ width: `${(row.count / total) * 100}%` }}
                  />
                </div>
                <span className="w-7 text-right">{toBn(row.count)}%</span>
              </div>
            ))}
          </div>

          <Link
            href="/reviews#review-form"
            className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1.5 rounded-full bg-forest-900 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
          >
            <PenLine size={13} />
            Write your review
          </Link>
        </div>

        <div className="space-y-2.5">
          {bookReviews.length > 0 ? (
            bookReviews.map((review) => (
              <article key={review.id} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <span
                      className="grid h-9 w-9 place-items-center rounded-full text-[10px] font-bold text-cream-50"
                      style={{ backgroundColor: review.avatarColor }}
                    >
                      {review.name.charAt(0)}
                    </span>
                    <div>
                      <p className="flex items-center gap-1.5 text-xs font-semibold text-forest-950">
                        {review.name}
                        {review.verified && (
                          <span className="rounded-full bg-forest-100 px-1.5 py-0.5 text-[7px] font-semibold text-forest-700">
                            Verified
                          </span>
                        )}
                      </p>
                      <p className="text-[9px] text-muted">
                        {review.location} · {review.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex gap-0.5 text-gold-500">
                    {Array.from({ length: review.rating }).map((_, index) => (
                      <Star key={index} size={11} className="fill-gold-500" />
                    ))}
                  </div>
                </div>
                <p className="mt-2.5 text-[11px] leading-relaxed text-forest-900/70 sm:text-xs">
                  {review.text}
                </p>
                <p className="mt-2 flex items-center gap-1 text-[9px] text-muted">
                  <ThumbsUp size={10} /> This review was helpful
                </p>
              </article>
            ))
          ) : (
            <div className="rounded-2xl border border-dashed border-forest-900/15 bg-cream-50 p-8 text-center">
              <Star size={22} className="mx-auto text-gold-500/40" />
              <p className="mt-2 text-sm font-semibold text-forest-900">
                Be the first to review this book
              </p>
              <p className="mt-1 text-[10px] text-muted">
                Share how the book made you feel — help other readers decide.
              </p>
              <Link
                href="/reviews#review-form"
                className="mt-3 inline-flex items-center gap-1 text-[11px] font-semibold text-clay-600 hover:text-clay-500"
              >
                Write a review
                <ArrowUpRight size={12} />
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
