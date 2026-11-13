"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  BadgeCheck,
  CheckCircle2,
  PenLine,
  Quote,
  Send,
  Star,
  ThumbsUp,
} from "lucide-react";
import { reviews, ratingBreakdown } from "@/data/reviews";
import { books } from "@/data/books";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const filters = ["All", "5 stars", "4 stars", "3 stars"] as const;

export function ReviewsExplorer() {
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({ name: "", location: "", bookSlug: books[0]?.slug ?? "", text: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const filtered = useMemo(() => {
    if (filter === "All") return reviews;
    const value = Number(filter.charAt(0));
    return reviews.filter((review) => review.rating === value);
  }, [filter]);

  const total = ratingBreakdown.reduce((sum, row) => sum + row.count, 0);
  const average = (ratingBreakdown.reduce((sum, row) => sum + row.stars * row.count, 0) / total).toFixed(1);

  const update = (patch: Partial<typeof form>) => setForm((previous) => ({ ...previous, ...patch }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "Please enter your name";
    if (form.location.trim().length < 2) next.location = "Enter your area or city";
    if (form.text.trim().length < 12) next.text = "Write at least 12 characters";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3 text-[12px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  return (
    <div className="grid gap-6 lg:grid-cols-[1fr_340px] lg:items-start">
      <div className="min-w-0">
        <div className="grid gap-3 sm:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
            <div className="flex items-end gap-3">
              <p className="font-display text-5xl font-bold leading-none text-forest-950">
                {toBn(Number(average))}
              </p>
              <div className="pb-1">
                <span className="flex gap-0.5 text-gold-500">
                  {[0, 1, 2, 3, 4].map((star) => (
                    <Star key={star} size={14} className="fill-gold-500" />
                  ))}
                </span>
                <p className="mt-1 text-[10px] text-muted">
                  {toBn(1240)}+ verified reviews
                </p>
              </div>
            </div>
            <div className="mt-4 space-y-1.5">
              {ratingBreakdown.map((row) => (
                <div key={row.stars} className="flex items-center gap-2 text-[9px] text-muted">
                  <span className="w-2">{toBn(row.stars)}</span>
                  <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-cream-300">
                    <div className="h-full rounded-full bg-gold-500" style={{ width: `${(row.count / total) * 100}%` }} />
                  </div>
                  <span className="w-8 text-right">{toBn(Math.round((row.count / total) * 100))}%</span>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col justify-between rounded-3xl bg-forest-950 p-5 text-cream-50">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                Reader Love
              </p>
              <p className="mt-1.5 font-display text-xl font-bold leading-snug">
                Your love as a reader is our greatest reward
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-cream-100/50">
                Books, delivery and service — your experience shapes what we do next.
              </p>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2 text-[9px]">
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1">
                {toBn(98)}% recommend
              </span>
              <span className="rounded-full border border-white/15 bg-white/5 px-2.5 py-1">
                {toBn(48)}-hour delivery
              </span>
            </div>
          </div>
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-xl font-bold text-forest-950">Reader reviews</h2>
            <p className="mt-0.5 text-[10px] text-muted">Curated experiences and opinions on our books</p>
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {filters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setFilter(item)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors",
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

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {filtered.map((review) => (
            <article key={review.id} className="flex h-full flex-col rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
              <div className="flex items-start justify-between">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star key={star} size={11} className={star < review.rating ? "fill-gold-500" : "text-cream-300"} />
                  ))}
                </div>
                <Quote size={22} className="text-forest-900/10" />
              </div>
              <p className="mt-2.5 flex-1 text-[11px] leading-relaxed text-forest-900/75 sm:text-xs">
                “{review.text}”
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-forest-900/8 pt-3">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-cream-50"
                  style={{ backgroundColor: review.avatarColor }}
                >
                  {review.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[10px] font-semibold text-forest-950">
                    {review.name}
                    {review.verified && <BadgeCheck size={11} className="text-forest-500" />}
                  </p>
                  <p className="text-[8px] text-muted">{review.location} · {review.date}</p>
                </div>
                <Link
                  href={`/books/${review.bookSlug}`}
                  className="max-w-[38%] truncate rounded-full bg-cream-100 px-2 py-1 text-[8px] text-forest-700 transition-colors hover:bg-forest-900 hover:text-cream-50"
                >
                  {review.bookTitle}
                </Link>
              </div>
            </article>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="mt-4 rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/40 px-6 py-12 text-center">
            <Star size={24} className="mx-auto text-gold-500/40" />
            <p className="mt-2 text-sm font-semibold text-forest-900">No reviews with this rating yet</p>
            <p className="mt-1 text-[10px] text-muted">Be the first to write one using the form below.</p>
          </div>
        )}

        <div className="mt-5 flex items-center gap-2 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-4 py-3 text-[10px] text-muted">
          <ThumbsUp size={13} className="text-forest-600" />
          Every review is checked before publishing. Insulting or promotional content is not published.
        </div>
      </div>

      <aside id="review-form" className="scroll-mt-[88px] lg:sticky lg:top-[88px]">
        <div className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
          <div className="border-b border-forest-900/8 bg-cream-100/50 px-5 py-4">
            <div className="flex items-center gap-2">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-900 text-gold-300">
                <PenLine size={16} />
              </span>
              <div>
                <h2 className="font-display text-base font-bold text-forest-950">Write your review</h2>
                <p className="text-[9px] text-muted">Your experience will help other readers</p>
              </div>
            </div>
          </div>

          {submitted ? (
            <div className="p-5 text-center">
              <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
                <CheckCircle2 size={22} />
              </span>
              <h3 className="mt-3 font-display text-lg font-bold text-forest-950">Thank you — your review has been submitted</h3>
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                The review will be published after verification. On this demo site
                it is only shown here and is not stored anywhere.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmitted(false);
                  setForm({ name: "", location: "", bookSlug: books[0]?.slug ?? "", text: "" });
                  setRating(5);
                }}
                className="mt-3 text-[10px] font-semibold text-clay-600 hover:text-clay-500"
              >
                Write another review
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate className="space-y-3 p-5">
              <div>
                <span className="mb-1 block text-[10px] font-semibold text-forest-900">Your rating</span>
                <div className="flex gap-1">
                  {[1, 2, 3, 4, 5].map((value) => (
                    <button
                      key={value}
                      type="button"
                      onClick={() => setRating(value)}
                      aria-label={`${value} stars`}
                      className="p-0.5"
                    >
                      <Star
                        size={22}
                        className={value <= rating ? "fill-gold-500 text-gold-500" : "text-cream-300"}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold text-forest-900">Your name</span>
                <input value={form.name} onChange={(event) => update({ name: event.target.value })} placeholder="Name" className={cn(inputClass, errors.name && "border-clay-500/70")} />
                {errors.name && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.name}</span>}
              </label>

              <div className="grid grid-cols-2 gap-2.5">
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold text-forest-900">Area</span>
                  <input value={form.location} onChange={(event) => update({ location: event.target.value })} placeholder="Dhaka" className={cn(inputClass, errors.location && "border-clay-500/70")} />
                  {errors.location && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.location}</span>}
                </label>
                <label className="block">
                  <span className="mb-1 block text-[10px] font-semibold text-forest-900">Book</span>
                  <select value={form.bookSlug} onChange={(event) => update({ bookSlug: event.target.value })} className={inputClass}>
                    {books.slice(0, 20).map((book) => (
                      <option key={book.slug} value={book.slug}>{book.title}</option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="block">
                <span className="mb-1 block text-[10px] font-semibold text-forest-900">Your thoughts</span>
                <textarea
                  value={form.text}
                  onChange={(event) => update({ text: event.target.value })}
                  rows={4}
                  placeholder="How did you like the book? How was the delivery and packaging?"
                  className={cn(
                    "w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3 py-2.5 text-[12px] leading-relaxed text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25",
                    errors.text && "border-clay-500/70",
                  )}
                />
                {errors.text && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.text}</span>}
              </label>

              <Button type="submit" size="sm" className="w-full">
                <Send size={13} /> Submit review
              </Button>
              <p className="text-center text-[8px] text-muted">Demo form · no data is sent to a server</p>
            </form>
          )}
        </div>
      </aside>
    </div>
  );
}
