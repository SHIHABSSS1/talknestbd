import Link from "next/link";
import { BadgeCheck, Quote, Star } from "lucide-react";
import { reviews } from "@/data/reviews";
import { toBn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function ReviewsWall() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="flex flex-wrap items-start justify-between gap-5">
          <SectionHeader
            eyebrow="Grahokder Boktobbo"
            title="পাঠকদের কথা"
            description="বই হোক বা সেবা — পাঠকদের অভিজ্ঞতাই আমাদের সবচেয়ে বড় পরিচয়।"
            href="/reviews"
            linkLabel="সব রিভিউ"
            className="mb-0 flex-1"
          />
          <div className="flex items-center gap-3 rounded-2xl border border-forest-900/10 bg-cream-100/80 px-4 py-3">
            <span className="font-display text-3xl font-bold text-forest-950">৪.৯</span>
            <div>
              <div className="flex gap-0.5 text-gold-500">
                {[0, 1, 2, 3, 4].map((star) => (
                  <Star key={star} size={12} className="fill-gold-500" />
                ))}
              </div>
              <p className="mt-0.5 text-[10px] text-muted">{toBn(1240)}+ ভেরিফায়েড রিভিউ</p>
            </div>
          </div>
        </div>

        <div className="mt-7 grid gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
          {reviews.slice(0, 6).map((review) => (
            <article
              key={review.id}
              className="flex h-full flex-col rounded-2xl border border-forest-900/8 bg-white/60 p-5 transition-colors hover:bg-white sm:p-6"
            >
              <div className="flex items-start justify-between">
                <div className="flex gap-0.5 text-gold-500">
                  {Array.from({ length: 5 }).map((_, star) => (
                    <Star
                      key={star}
                      size={12}
                      className={star < review.rating ? "fill-gold-500" : "text-cream-300"}
                    />
                  ))}
                </div>
                <Quote size={24} className="text-forest-900/10" />
              </div>
              <p className="mt-3 flex-1 text-[13px] leading-relaxed text-forest-900/75">
                “{review.text}”
              </p>
              <div className="mt-5 flex items-center gap-2.5 border-t border-forest-900/8 pt-4">
                <span
                  className="grid h-9 w-9 shrink-0 place-items-center rounded-full font-display text-xs font-bold text-cream-50"
                  style={{ backgroundColor: review.avatarColor }}
                >
                  {review.name.charAt(0)}
                </span>
                <div className="min-w-0 flex-1">
                  <p className="flex items-center gap-1 text-xs font-semibold text-forest-950">
                    {review.name}
                    {review.verified && (
                      <BadgeCheck size={12} className="text-forest-500" />
                    )}
                  </p>
                  <p className="text-[9px] text-muted">
                    {review.location} · {review.date}
                  </p>
                </div>
                <Link
                  href={`/books/${review.bookSlug}`}
                  className="max-w-[35%] truncate rounded-full bg-cream-100 px-2.5 py-1 text-[9px] text-forest-700 transition-colors hover:bg-forest-900 hover:text-cream-50"
                >
                  {review.bookTitle}
                </Link>
              </div>
            </article>
          ))}
        </div>
      </Container>
    </section>
  );
}
