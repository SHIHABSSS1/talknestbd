"use client";

import Link from "next/link";
import { useState } from "react";
import { BadgeCheck, Heart, Send, MessageSquareText, Star } from "lucide-react";
import { useReviews } from "@/components/providers/ReviewsProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { ReviewReply } from "@/components/ui/ReviewReply";
import type { ReviewRequest } from "@/lib/review-requests";

const filters = ["All", "5 stars", "4 stars", "3 stars"] as const;
const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function ReviewsExplorer() {
  const { content, addRequest } = useReviews();
  const { books } = useBookContent();
  const [filter, setFilter] = useState<(typeof filters)[number]>("All");
  const [rating, setRating] = useState(5);
  const [form, setForm] = useState({ name: "", location: "", bookSlug: books[0]?.slug ?? "", text: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const shown = content.reviews.filter((review) =>
    filter === "All" ? true : review.rating === Number(filter.charAt(0)),
  );
  const total = content.reviews.length || 1;
  const average =
    content.reviews.reduce((sum, review) => sum + review.rating, 0) / total;

  const update = (patch: Partial<typeof form>) => {
    setForm((current) => ({ ...current, ...patch }));
    setErrors({});
  };

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
    const selectedBook = books.find((book) => book.slug === form.bookSlug);
    const request: ReviewRequest = {
      id: `req-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      location: form.location.trim(),
      rating,
      text: form.text.trim(),
      bookSlug: form.bookSlug,
      bookTitle: selectedBook?.title ?? "General experience",
      status: "Pending",
    };
    addRequest(request);
    setErrors({});
    setSubmitted(true);
    setForm({ name: "", location: "", bookSlug: books[0]?.slug ?? "", text: "" });
  };

  if (submitted) {
    return (
      <div className="mx-auto max-w-2xl rounded-3xl border border-forest-900/10 bg-cream-50 p-8 text-center sm:p-10">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-100 text-forest-700">
          <CheckIcon />
        </span>
        <h2 className="mt-4 font-display text-xl font-bold text-forest-950">
          {content.page.successTitle}
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
          {content.page.successText}
        </p>
        <Button type="button" variant="outline" className="mt-5" onClick={() => setSubmitted(false)}>
          Write another review
        </Button>
      </div>
    );
  }

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
            {toBn(content.page.reviewCount)}{content.page.pills[0]}
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
          <article key={review.id} className="flex flex-col rounded-2xl border border-forest-900/8 bg-cream-50 p-5">
            <div className="flex items-center gap-0.5 text-gold-500">
              {Array.from({ length: review.rating }).map((_, index) => (
                <Star key={index} size={12} className="fill-sale text-sale" />
              ))}
            </div>
            <p className="mt-3 flex-1 text-[11px] leading-relaxed text-forest-900/75">“{review.text}”</p>
            {review.reply && (
              <ReviewReply reply={review.reply} date={review.replyDate} />
            )}
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
            <Link href={`/books/${review.bookSlug}`} className="mt-3 truncate text-[10px] font-semibold text-brand-700 hover:underline">
              {review.bookTitle}
            </Link>
          </article>
        ))}
      </div>

      {shown.length === 0 && (
        <p className="rounded-2xl border border-line bg-white p-8 text-center text-sm text-muted">
          No reviews with this rating yet — be the first to write one using the form below.
        </p>
      )}

      <section id="review-form" className="grid gap-6 rounded-3xl border border-forest-900/8 bg-cream-50 p-6 lg:grid-cols-[0.9fr_1.1fr] sm:p-8">
        <div>
          <p className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-brand-600">
            <MessageSquareText size={13} /> Share your experience
          </p>
          <h2 className="mt-2 font-display text-2xl font-bold text-forest-950">Write a review</h2>
          <p className="mt-2 text-[11px] leading-relaxed text-muted">{content.page.moderationNote}</p>
        </div>
        <form onSubmit={submit} noValidate className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-semibold text-forest-900">Your rating</span>
            {[1, 2, 3, 4, 5].map((value) => (
              <button
                key={value}
                type="button"
                onClick={() => setRating(value)}
                aria-label={`${value} stars`}
                className="transition-transform hover:scale-110"
              >
                <Star size={20} className={cn(value <= rating ? "fill-sale text-sale" : "text-forest-900/20")} />
              </button>
            ))}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <label className="block">
              <input
                value={form.name}
                onChange={(event) => update({ name: event.target.value })}
                placeholder="Your name"
                className={cn(inputClass, errors.name && "border-clay-500/70")}
              />
              {errors.name && <span className="mt-1 block text-[10px] text-clay-600">{errors.name}</span>}
            </label>
            <label className="block">
              <input
                value={form.location}
                onChange={(event) => update({ location: event.target.value })}
                placeholder="Your area or city"
                className={cn(inputClass, errors.location && "border-clay-500/70")}
              />
              {errors.location && <span className="mt-1 block text-[10px] text-clay-600">{errors.location}</span>}
            </label>
          </div>
          <label className="block">
            <select value={form.bookSlug} onChange={(event) => update({ bookSlug: event.target.value })} className={inputClass}>
              {books.slice(0, 20).map((book) => (
                <option key={book.slug} value={book.slug}>{book.title}</option>
              ))}
            </select>
          </label>
          <label className="block">
            <textarea
              value={form.text}
              onChange={(event) => update({ text: event.target.value })}
              rows={4}
              placeholder="Tell other readers about your experience…"
              className={cn("w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-3 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25", errors.text && "border-clay-500/70")}
            />
            {errors.text && <span className="mt-1 block text-[10px] text-clay-600">{errors.text}</span>}
          </label>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-[9px] text-muted">Demo form · saved in this browser only</p>
            <Button type="submit" size="sm">
              <Send size={13} /> Submit review
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CheckIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
