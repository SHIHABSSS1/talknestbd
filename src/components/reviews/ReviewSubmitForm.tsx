"use client";

import { useState } from "react";
import Link from "next/link";
import { AlertCircle, CheckCircle2, Star } from "lucide-react";

import { useReviews } from "@/components/providers/ReviewsProvider";
import { useSession } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

const fieldClass =
  "w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-3 text-[12px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

/** Logged-in reader review form, used on book and audiobook detail surfaces. */
export function ReviewSubmitForm({
  bookSlug,
  bookTitle,
  kind = "book",
  compact = false,
}: {
  bookSlug: string;
  bookTitle: string;
  kind?: "book" | "audio";
  compact?: boolean;
}) {
  const { submit } = useReviews();
  const { data: session } = useSession();
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<{ text: string; ok: boolean } | null>(null);

  if (!session?.user) {
    return (
      <div className={cn("rounded-xl border border-dashed border-forest-900/15 bg-cream-50 p-4", compact && "p-3")}>
        <p className="text-[11px] text-forest-800/75">
          Sign in to share your review of <strong>{bookTitle}</strong>.
        </p>
        <Link
          href="/login"
          className="mt-2 inline-flex h-8 items-center rounded-full bg-forest-900 px-4 text-[10px] font-semibold text-cream-50 hover:bg-forest-700"
        >
          Sign in to review
        </Link>
      </div>
    );
  }

  const onSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (title.trim().length < 2 || text.trim().length < 10) {
      setNotice({ ok: false, text: "Add a title and a review of at least 10 characters." });
      return;
    }
    setBusy(true);
    setNotice(null);
    try {
      const result = await submit({
        rating,
        title: title.trim(),
        text: text.trim(),
        bookSlug,
        bookTitle,
        kind,
      });
      setNotice({ ok: result.ok, text: result.message });
      if (result.ok) {
        setTitle("");
        setText("");
        setRating(5);
      }
    } catch (error) {
      setNotice({
        ok: false,
        text: error instanceof Error ? error.message : "Could not submit the review.",
      });
    } finally {
      setBusy(false);
    }
  };

  return (
    <form
      onSubmit={onSubmit}
      className={cn("space-y-3 rounded-xl border border-forest-900/10 bg-cream-50 p-4", compact && "p-3")}
    >
      <div>
        <p className="mb-1.5 text-[10px] font-semibold text-forest-800">Your rating</p>
        <div className="flex gap-1" role="group" aria-label="Star rating">
          {[1, 2, 3, 4, 5].map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setRating(value)}
              aria-label={`${value} star${value === 1 ? "" : "s"}`}
              aria-pressed={rating === value}
              className="rounded p-0.5 text-gold-500 transition-transform hover:scale-110"
            >
              <Star size={compact ? 16 : 20} className={value <= rating ? "fill-gold-500" : ""} />
            </button>
          ))}
        </div>
      </div>
      <label className="block">
        <span className="mb-1.5 block text-[10px] font-semibold text-forest-800">Review title</span>
        <input
          value={title}
          onChange={(event) => setTitle(event.target.value)}
          maxLength={160}
          placeholder="Sum it up in a few words"
          className={fieldClass}
        />
      </label>
      <label className="block">
        <span className="mb-1.5 block text-[10px] font-semibold text-forest-800">Your review</span>
        <textarea
          value={text}
          onChange={(event) => setText(event.target.value)}
          rows={compact ? 3 : 4}
          maxLength={3000}
          placeholder="What did you think? Share the details that would help another reader."
          className={fieldClass}
        />
      </label>
      {notice && (
        <p
          role="status"
          className={cn(
            "flex items-start gap-1.5 text-[10px] leading-relaxed",
            notice.ok ? "text-forest-700" : "text-clay-600",
          )}
        >
          {notice.ok ? <CheckCircle2 size={12} className="mt-0.5 shrink-0" /> : <AlertCircle size={12} className="mt-0.5 shrink-0" />}
          {notice.text}
        </p>
      )}
      <button
        type="submit"
        disabled={busy}
        className="inline-flex h-9 items-center justify-center rounded-full bg-forest-900 px-5 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700 disabled:opacity-50"
      >
        {busy ? "Submitting…" : "Submit review"}
      </button>
      <p className="text-[9px] text-muted">
        Reviews are published after admin approval. Demo site — no real payment or purchase required.
      </p>
    </form>
  );
}
