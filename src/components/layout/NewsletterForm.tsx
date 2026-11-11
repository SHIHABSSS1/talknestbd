"use client";

import { useState } from "react";
import { CheckCircle2, Send } from "lucide-react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);

  if (sent) {
    return (
      <div className="flex items-center gap-3 rounded-2xl border border-gold-400/30 bg-white/5 px-5 py-4 text-sm text-cream-100">
        <CheckCircle2 className="shrink-0 text-gold-400" size={20} />
        ধন্যবাদ! নতুন বই ও অফারের খবর আপনার ইনবক্সে পৌঁছে যাবে।
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
        ইমেইল ঠিকানা
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        required
        placeholder="আপনার ইমেইল ঠিকানা"
        className="h-12 flex-1 rounded-full border border-white/15 bg-white/10 px-5 text-sm text-cream-50 placeholder:text-cream-100/40 focus:border-gold-400/50 focus:outline-none focus:ring-2 focus:ring-gold-500/20"
      />
      <button
        type="submit"
        className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gold-500 px-6 text-sm font-semibold text-forest-950 transition-colors hover:bg-gold-400"
      >
        সাবস্ক্রাইব
        <Send size={15} />
      </button>
    </form>
  );
}
