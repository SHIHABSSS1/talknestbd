"use client";

import { useId, useState } from "react";
import { CheckCircle2, Mail, Send, ShieldCheck } from "lucide-react";

export function NewsletterForm() {
  const [sent, setSent] = useState(false);
  // The footer and the blog page both mount this form, so the field id has
  // to be unique or the label would point at the wrong input.
  const fieldId = `newsletter-email-${useId().replace(/[^a-zA-Z0-9_-]/g, "")}`;

  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-[10px] border border-brand-100 bg-brand-50 p-5">
        <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-mint/40 text-brand-700">
          <CheckCircle2 size={19} />
        </span>
        <span>
          <span className="block text-[15px] font-bold leading-snug text-ink">
            You are on the reading list.
          </span>
          <span className="mt-1 block text-[12px] leading-relaxed text-body">
            New books, reader stories and subscriber-only offers will arrive soon.
          </span>
        </span>
      </div>
    );
  }

  return (
    <div className="rounded-[10px] bg-white p-5 shadow-[0_18px_45px_-30px_rgba(8,42,82,0.55)] sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-brand-50 text-brand-600">
          <Mail size={16} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold leading-tight text-ink">
            Get the weekly letter
          </p>
          <p className="text-[11px] leading-tight text-muted">
            One email, every Thursday
          </p>
        </div>
      </div>

      <form
        onSubmit={(event) => {
          event.preventDefault();
          setSent(true);
        }}
        className="mt-4"
      >
        <label
          htmlFor={fieldId}
          className="block text-[11px] font-semibold text-body"
        >
          Email address
        </label>
        <div className="mt-1.5 flex flex-col gap-2.5 sm:flex-row">
          <div className="relative min-w-0 flex-1">
            <Mail
              size={15}
              aria-hidden="true"
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
            />
            <input
              id={fieldId}
              name="email"
              type="email"
              inputMode="email"
              autoComplete="email"
              required
              placeholder="you@example.com"
              className="h-11 w-full min-w-0 rounded-[6px] border border-line bg-white pl-10 pr-3.5 text-[13px] text-ink shadow-[inset_0_1px_2px_rgba(17,24,39,0.04)] placeholder:text-muted/80 transition-colors focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-200"
            />
          </div>
          <button
            type="submit"
            className="inline-flex h-11 shrink-0 items-center justify-center gap-2 rounded-[6px] bg-brand-600 px-5 text-[13px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Join the letter
            <Send size={14} />
          </button>
        </div>
      </form>

      <p className="mt-3 flex items-center gap-1.5 text-[10px] text-muted">
        <ShieldCheck size={12} className="text-brand-500" />
        Your email stays private. No daily spam.
      </p>
    </div>
  );
}
