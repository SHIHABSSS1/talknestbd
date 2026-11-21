"use client";

import Link from "next/link";
import { BadgeCheck, Pin, Quote, Star } from "lucide-react";

import { useReviews } from "@/components/providers/ReviewsProvider";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { ReviewReply } from "@/components/ui/ReviewReply";
import type { Review } from "@/lib/types";

function ReviewCard({ review }: { review: Review }) {
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
      <Quote size={15} className="mt-3 text-brand-300" />
      <p className="mt-1 text-[11px] font-semibold text-forest-950">{review.title}</p>
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
        className="mt-3 max-w-[70%] truncate rounded-full bg-white px-2.5 py-1 text-[9px] font-medium text-brand-700 hover:bg-brand-50"
      >
        {review.bookTitle}
      </Link>
    </article>
  );
}

export function ReviewsWall() {
  const { content, reviews, pinned, total, loading } = useReviews();

  if (!loading && reviews.length === 0 && pinned.length === 0) return null;

  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={content.section.eyebrow}
          title={content.section.title}
          description={content.section.description}
          href="/reviews"
          linkLabel={content.section.linkLabel}
          className="mb-0 flex-1"
        />

        <div className="mt-6 flex flex-wrap items-center gap-2.5">
          <span className="font-display text-2xl font-bold text-forest-950">
            {content.page.ratingValue}
          </span>
          <span className="flex items-center gap-0.5 text-gold-500">
            {Array.from({ length: 5 }).map((_, index) => (
              <Star key={index} size={11} className="fill-sale text-sale" />
            ))}
          </span>
          <span className="text-[11px] text-muted">
            {formatCount(total || Number(content.page.reviewCount))}+ verified reviews
          </span>
        </div>

        {pinned.length > 0 && (
          <div className="mt-7">
            <h3 className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700">
              <Pin size={12} /> Featured reader reviews
            </h3>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {pinned.slice(0, 3).map((review) => (
                <ReviewCard key={review.id} review={review} />
              ))}
            </div>
          </div>
        )}

        <div className="mt-6 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
          {loading && (
            <p className="col-span-full py-6 text-center text-[11px] text-muted">
              Loading reviews…
            </p>
          )}
        </div>

        <ViewAllRow
          href="/reviews"
          label={content.section.linkLabel}
          count={`${total} reviews`}
        />
      </Container>
    </section>
  );
}
