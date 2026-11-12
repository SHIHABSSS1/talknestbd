"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex items-center gap-3 border border-white/25 bg-white/10 px-5 py-4 text-sm text-white">
        <CheckCircle2 className="shrink-0 text-white" size={20} />
        Thank you! New books and offers will land in your inbox soon.
      </div>
    );
  }

  return (
    <form
      onSubmit={(event) => {
        event.preventDefault();
        setSent(true);
      }}
      className="flex flex-col gap-3 sm:flex-row"
    >
      <label className="sr-only" htmlFor="newsletter-email">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="Enter your email address"
        className="h-12 flex-1 rounded-full border border-white/30 bg-white px-5 text-sm text-ink placeholder:text-muted focus:border-white focus:outline-none focus:ring-2 focus:ring-white/30"
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-sale px-6 text-sm font-bold text-ink transition-colors hover:bg-gold-400"
      >
        Subscribe
        <Send size={15} />
      </button>
    </form>
  );
}
