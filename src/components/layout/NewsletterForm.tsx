"use client";

import { useState } from "react";
import { CheckCircle2, Send, ShieldCheck } from "lucide-react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-[8px] border border-white/25 bg-white/10 px-5 py-4 text-white backdrop-blur">
        <CheckCircle2 className="mt-0.5 shrink-0 text-mint" size={21} />
        <span>
          <span className="block text-sm font-semibold">You are on the reading list.</span>
          <span className="mt-0.5 block text-[11px] text-white/65">
            New books and subscriber offers will arrive soon.
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-[8px] border border-white/20 bg-white/10 p-3 backdrop-blur-sm sm:p-4">
      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <label className="sr-only" htmlFor="newsletter-email">
          Email address
        </label>
        <input
          id="newsletter-email"
          name="email"
          type="email"
          required
          placeholder="you@example.com"
          className="h-12 min-w-0 flex-1 rounded-[4px] border border-white bg-white px-4 text-sm text-ink placeholder:text-muted focus:border-brand-200 focus:outline-none focus:ring-2 focus:ring-white/35"
        />
        <button
          type="submit"
          className="inline-flex h-12 items-center justify-center gap-2 rounded-[4px] bg-sale px-5 text-[13px] font-bold text-ink transition-colors hover:bg-gold-400"
        >
          Join the letter
          <Send size={14} />
        </button>
      </form>
      <p className="mt-2.5 flex items-center gap-1.5 text-[9px] text-white/55">
        <ShieldCheck size={11} /> Your email stays private. No daily spam.
      </p>
    </div>
  );
}
