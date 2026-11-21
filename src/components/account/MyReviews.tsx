"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { CheckCircle2, Clock3, MessageSquareReply, Star, XCircle } from "lucide-react";

import { accountFetch } from "@/lib/account-client";
import { ReviewReply } from "@/components/ui/ReviewReply";
import { cn } from "@/lib/utils";
import type { Review, ReviewStatus } from "@/lib/types";

const statusMeta: Record<ReviewStatus, { label: string; className: string; icon: typeof CheckCircle2 }> = {
  approved: { label: "Approved", className: "bg-mint/25 text-forest-700", icon: CheckCircle2 },
  pending: { label: "Pending", className: "bg-gold-300/25 text-gold-600", icon: Clock3 },
  rejected: { label: "Rejected", className: "bg-clay-500/10 text-clay-600", icon: XCircle },
};

export function MyReviews() {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    accountFetch<{ reviews: Review[] }>("/api/account/reviews")
      .then((data) => {
        if (active) setReviews(data.reviews ?? []);
      })
      .catch((reason: unknown) => {
        if (active) {
          setError(reason instanceof Error ? reason.message : "Could not load your reviews.");
        }
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="font-display text-xl font-bold text-ink">My reviews</h2>
          <p className="mt-1 text-[12px] text-muted">
            Reviews you submitted, with their moderation status.
          </p>
        </div>
        <Link
          href="/reviews#review-form"
          className="inline-flex h-9 items-center rounded-full bg-forest-900 px-4 text-[11px] font-semibold text-cream-50 hover:bg-forest-700"
        >
          Write a review
        </Link>
      </div>

      {error && (
        <p role="alert" className="rounded-xl border border-clay-500/30 bg-clay-500/10 p-3 text-[11px] text-clay-600">
          {error}
        </p>
      )}
      {loading && (
        <p className="rounded-xl border border-line bg-white p-8 text-center text-[11px] text-muted">
          Loading your reviews…
        </p>
      )}

      {!loading && !error && reviews.length === 0 && (
        <div className="rounded-xl border border-dashed border-line bg-white p-8 text-center">
          <MessageSquareReply size={22} className="mx-auto text-muted/50" />
          <p className="mt-2 text-sm font-semibold text-ink">You have not written a review yet</p>
          <p className="mt-1 text-[11px] text-muted">
            Share your experience with a book or audiobook — it helps other readers choose.
          </p>
        </div>
      )}

      <div className="space-y-3">
        {reviews.map((review) => {
          const meta = statusMeta[review.status];
          const Icon = meta.icon;
          return (
            <article key={review.id} className="rounded-xl border border-line bg-white p-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="flex gap-0.5 text-gold-500">
                      {Array.from({ length: 5 }).map((_, index) => (
                        <Star key={index} size={12} className={index < review.rating ? "fill-sale text-sale" : ""} />
                      ))}
                    </span>
                    <span className={cn("inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[9px] font-semibold", meta.className)}>
                      <Icon size={10} /> {meta.label}
                    </span>
                  </div>
                  <h3 className="mt-2 text-[13px] font-semibold text-ink">{review.title}</h3>
                </div>
                <p className="text-[9px] text-muted">
                  {new Date(review.createdAt).toLocaleDateString()}
                </p>
              </div>
              <p className="mt-2 text-[11px] leading-relaxed text-muted">{review.text}</p>
              <p className="mt-2 text-[10px] font-medium text-brand-700">
                {review.bookTitle} · {review.kind === "audio" ? "Audiobook" : "Book"}
              </p>
              {review.reply && <ReviewReply reply={review.reply} date={review.replyDate} compact />}
              {review.status === "rejected" && (
                <p className="mt-2 text-[10px] text-clay-600">
                  This review did not meet our publishing guidelines. You can submit a new one.
                </p>
              )}
              {review.status === "pending" && (
                <p className="mt-2 text-[10px] text-gold-600">
                  Awaiting moderation — usually within one business day.
                </p>
              )}
            </article>
          );
        })}
      </div>
    </div>
  );
}
