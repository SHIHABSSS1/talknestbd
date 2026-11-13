import Link from "next/link";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";

export function ReviewsWall() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionHeader
            eyebrow="Reader reviews"
            title="What readers are saying"
            description="A book, a delivery or a buyback — the reader experience is the only review that matters."
            href="/reviews"
            linkLabel="All reviews"
            className="mb-0 flex-1"
          />
          <div className="flex items-center gap-2.5 rounded-[8px] border border-brand-100 bg-brand-50 px-3.5 py-2.5">
            <span className="text-2xl font-bold leading-none text-brand-800">4.9</span>
            <div>
              <div className="flex gap-0.5 text-sale">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} size={11} className="fill-sale" />
                ))}
              </div>
              <p className="mt-0.5 text-[10px] text-muted">
                {formatCount(1240)}+ verified reviews
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <article
              key={review.id}
              className="flex h-full flex-col rounded-[8px] border border-line bg-white p-4 transition-colors hover:border-brand-300 sm:p-5"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-0.5 text-sale">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star
                      key={star}
                      size={11}
                      className={star < review.rating ? "fill-sale" : "text-line"}
                    />
                  ))}
                </div>
                <Quote size={22} className="text-brand-100" />
              </div>
              <p className="mt-2.5 flex-1 text-[13px] leading-relaxed text-body">
                &ldquo;{review.text}&rdquo;
              </p>
              <div className="mt-4 flex items-center gap-2.5 border-t border-line pt-3.5">
                <span
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-[10px] font-bold text-white"
                  style={{ backgroundColor: review.avatarColor }}
                >
                  {review.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-[11px] font-medium text-ink">
                    {review.name}
                    {review.verified && (
                      <BadgeCheck size={12} className="text-brand-500" />
                    )}
                  </p>
                  <p className="text-[9px] text-muted">
                    {review.location} · {review.date}
                  </p>
                </div>
                <Link
                  href={`/books/${review.bookSlug}`}
                  className="max-w-[35%] truncate rounded-[3px] bg-brand-50 px-2 py-1 text-[9px] text-brand-700 transition-colors hover:bg-brand-600 hover:text-white"
                >
                  {review.bookTitle}
                </Link>
              </div>
            </article>
          ))}
        </div>

        <ViewAllRow
          href="/reviews"
          label="All reviews"
          count={`${reviews.length} recent`}
        />
      </Container>
    </section>
  );
}
