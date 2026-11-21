"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Heart, MessageSquareText, Pin, Star } from "lucide-react";

import { useReviews } from "@/components/providers/ReviewsProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { ReviewSubmitForm } from "@/components/reviews/ReviewSubmitForm";
import { cn, toBn } from "@/lib/utils";
import { ReviewReply } from "@/components/ui/ReviewReply";

const filters = ["All", "5 stars", "4 stars", "3 stars"] as const;
const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function ReviewsExplorer() {
  const { content, reviews, pinned, total, loading } = useReviews();
  const { books } = useBookContent();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [selectedSlug, setSelectedSlug] = useState(books[0]?.slug ?? "");

  const shown = reviews.filter((review) =>
    filter === "All" ? true : review.rating === Number(filter.charAt(0)),
  );
  const rated = reviews.length;
  const average = rated
    ? reviews.reduce((sum, review) => sum + review.rating, 0) / rated
    : 0;
  const selectedBook =
    books.find((book) => book.slug === selectedSlug) ?? books[0];
  const selectedKind: "book" | "audio" = selectedBook?.tags.includes("audio")
    ? "audio"
    : "book";

  return (
    <div className="space-y-6">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-6">
          <p className="font-display text-5xl font-bold text-forest-950">
            {toBn(Number(average.toFixed(1)))}
          </p>
          <div className="mt-2 flex items-center gap-1 text-gold-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={16} className="fill-sale text-sale" />
            ))}
          </div>
          <p className="mt-2 text-[11px] text-muted">
            {toBn(total)}{content.page.pills[0]}
          </p>
          <p className="mt-1 text-[10px] text-muted">
            {toBn(Number(average.toFixed(1)))}{content.page.pills[1]}
          </p>
        </div>
        <div className="rounded-3xl bg-forest-950 p-6 text-cream-50">
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-300">
            <Heart size={13} /> {content.page.loveLabel}
          </p>
          <h3 className="mt-2 font-display text-xl font-bold">{content.page.loveTitle}</h3>
          <p className="mt-2 text-[11px] leading-relaxed text-cream-100/60">{content.page.loveText}</p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px]">
              98{content.page.lovePills[0]}
            </span>
            <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px]">
              48{content.page.lovePills[1]}
            </span>
          </div>
        </div>
      </div>

      {pinned.length > 0 && (
        <section>
          <h2 className="mb-3 flex items-center gap-1.5 font-display text-lg font-bold text-forest-950">
            <Pin size={15} className="text-gold-600" /> Featured reviews
          </h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pinned.map((review) => (
              <ReviewCard key={review.id} review={review} />
            ))}
          </div>
        </section>
      )}

      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-brand-600">
            {content.page.headingDescription}
          </p>
          <h2 className="font-display text-xl font-bold text-forest-950">{content.page.heading}</h2>
        </div>
        <div className="flex flex-wrap gap-2">
          {filters.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={cn(
                "rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
                filter === item
                  ? "border-forest-900 bg-forest-900 text-cream-50"
                  : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
              )}
            >
              {item}
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((review) => (
          <ReviewCard key={review.id} review={review} />
        ))}
      </div>

      {loading && (
        <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          Loading reviews…
        </p>
      )}
      {!loading && shown.length === 0 && (
        <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          No reviews with this rating yet — be the first to write one using the form below.
        </p>
      )}

      <section
        id="review-form"
        className="grid gap-6 rounded-3xl border border-forest-900/8 bg-cream-50 p-6 lg:grid-cols-[0.9fr_1.1fr] sm:p-8"
      >
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-600">
            <MessageSquareText size={13} /> Share your experience
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-forest-950">Write a review</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">{content.page.moderationNote}</p>
          <label className="mt-4 block">
            <span className="mb-1.5 block text-[10px] font-semibold text-forest-800">
              Choose a book or audiobook
            </span>
            <select
              value={selectedSlug}
              onChange={(event) => setSelectedSlug(event.target.value)}
              className={inputClass}
            >
              {books.slice(0, 30).map((book) => (
                <option key={book.slug} value={book.slug}>
                  {book.title}{book.tags.includes("audio") ? " (Audiobook)" : ""}
                </option>
              ))}
            </select>
          </label>
        </div>
        {selectedBook ? (
          <ReviewSubmitForm
            key={selectedBook.slug}
            bookSlug={selectedBook.slug}
            bookTitle={selectedBook.title}
            kind={selectedKind}
          />
        ) : (
          <p className="text-[11px] text-muted">No catalogue titles available yet.</p>
        )}
      </section>
    </div>
  );
}

function ReviewCard({ review }: { review: import("@/lib/types").Review }) {
  return (
    <article className="flex flex-col rounded-2xl border border-forest-900/8 bg-cream-50 p-5">
      <div className="flex items-center justify-between gap-2">
        <span className="flex items-center gap-0.5 text-gold-500">
          {Array.from({ length: review.rating }).map((_, index) => (
            <Star key={index} size={12} className="fill-sale text-sale" />
          ))}
        </span>
        {review.pinned && (
          <span className="inline-flex items-center gap-1 rounded-full bg-gold-300/25 px-2 py-0.5 text-[8px] font-bold uppercase tracking-wide text-gold-600">
            <Pin size={9} /> Featured
          </span>
        )}
      </div>
      <p className="mt-3 text-[11px] font-semibold text-forest-950">{review.title}</p>
      <p className="mt-1 flex-1 text-[11px] leading-relaxed text-forest-900/75">“{review.text}”</p>
      {review.reply && <ReviewReply reply={review.reply} date={review.replyDate} />}
      <div className="mt-4 flex items-center gap-2.5">
        <span
          className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[11px] font-bold text-white"
          style={{ backgroundColor: review.avatarColor }}
        >
          {review.name.charAt(0)}
        </span>
        <div className="min-w-0">
          <p className="flex items-center gap-1 text-[11px] font-semibold text-forest-950">
            {review.name}
            {review.verified && <BadgeCheck size={12} className="text-brand-600" />}
          </p>
          <p className="text-[9px] text-muted">{review.location} · {review.date}</p>
        </div>
      </div>
      <Link
        href={review.kind === "audio" ? "/audio-books" : `/books/${review.bookSlug}`}
        className="mt-3 truncate text-[10px] font-semibold text-brand-700 hover:underline"
      >
        {review.bookTitle}
      </Link>
    </article>
  );
}
