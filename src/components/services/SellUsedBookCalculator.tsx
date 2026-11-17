"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Calculator,
  CheckCircle2,
  Info,
  Repeat2,
} from "lucide-react";
import { books } from "@/data/books";
import { formatPrice, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const conditions = [
  { key: "like-new", label: "Like new", rate: 50, note: "Pages, binding and cover intact" },
  { key: "good", label: "Good", rate: 45, note: "Normal signs of use" },
  { key: "fair", label: "Fair", rate: 35, note: "May have marks or creases" },
] as const;

export function BuybackCalculator() {
  const [bookSlug, setBookSlug] = useState(books[0]?.slug ?? "");
  const [purchasePrice, setPurchasePrice] = useState(String(books[0]?.price ?? 380));
  const [condition, setCondition] = useState<(typeof conditions)[number]["key"]>("like-new");
  const [submitted, setSubmitted] = useState(false);

  const selectedBook = books.find((book) => book.slug === bookSlug);
  const activeCondition = conditions.find((entry) => entry.key === condition) ?? conditions[0];
  const price = Number(purchasePrice.replace(/[^\d]/g, "")) || 0;
  const amount = Math.round((price * activeCondition.rate) / 100);
  const percent = useMemo(() => activeCondition.rate, [activeCondition]);

  const eligible = price > 0 && price <= 20000;

  return (
    <div id="calculator" className="scroll-mt-[88px] overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
      <div className="border-b border-forest-900/8 bg-cream-100/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-900 text-gold-300">
            <Calculator size={16} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-forest-950">Buyback Calculator</h2>
            <p className="text-[9px] text-muted">See an estimated buyback value based on the book&apos;s condition</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">Choose a book</span>
            <select
              value={bookSlug}
              onChange={(event) => {
                const next = event.target.value;
                setBookSlug(next);
                const book = books.find((entry) => entry.slug === next);
                if (book) setPurchasePrice(String(book.price));
              }}
              className="h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3 text-[12px] text-forest-950 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            >
              {books.slice(0, 18).map((book) => (
                <option key={book.slug} value={book.slug}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">Purchase price (৳)</span>
            <input
              value={purchasePrice}
              onChange={(event) => setPurchasePrice(event.target.value)}
              inputMode="numeric"
              placeholder="e.g. 380"
              className="h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            />
            {selectedBook && (
              <span className="mt-1 block text-[9px] text-muted">
                Current price of {selectedBook.title}: {formatPrice(selectedBook.price)}
              </span>
            )}
          </label>
        </div>

        <div className="mt-3">
          <span className="mb-1.5 block text-[11px] font-semibold text-forest-900">Book condition</span>
          <div className="grid gap-2 sm:grid-cols-3">
            {conditions.map((entry) => (
              <button
                key={entry.key}
                type="button"
                onClick={() => setCondition(entry.key)}
                className={
                  condition === entry.key
                    ? "rounded-xl border border-forest-800 bg-forest-900 px-3 py-2.5 text-left text-cream-50"
                    : "rounded-xl border border-forest-900/12 bg-cream-50 px-3 py-2.5 text-left text-forest-900 transition-colors hover:border-forest-900/30"
                }
              >
                <span className="flex items-center justify-between gap-1 text-[11px] font-semibold">
                  {entry.label}
                  <span className={condition === entry.key ? "text-gold-300" : "text-clay-600"}>
                    {toBn(entry.rate)}%
                  </span>
                </span>
                <span className={condition === entry.key ? "mt-0.5 block text-[8px] text-cream-100/50" : "mt-0.5 block text-[8px] text-muted"}>
                  {entry.note}
                </span>
              </button>
            ))}
          </div>
        </div>

        <div className="mt-4 rounded-2xl bg-forest-950 p-4 text-cream-50">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="flex items-center gap-1.5 text-[9px] uppercase tracking-[0.16em] text-gold-400">
                <Banknote size={12} /> Estimated buyback
              </p>
              <p className="mt-1 font-display text-3xl font-bold">
                {eligible ? formatPrice(amount) : "৳0"}
              </p>
              <p className="mt-0.5 text-[9px] text-cream-100/45">
                {formatPrice(price)} × {toBn(percent)}% · final value after inspecting the book
              </p>
            </div>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1.5 text-[9px] font-semibold text-gold-300">
              <Repeat2 size={11} />
              {activeCondition.label}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-gold-500/8 px-3 py-2.5 text-[9px] leading-relaxed text-forest-800/70">
          <Info size={12} className="mt-0.5 shrink-0 text-gold-600" />
          This is only an estimate. The final value is confirmed after we receive
          and inspect the book. Textbooks and older editions may not be eligible for buyback.
        </div>

        {submitted ? (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-forest-500/20 bg-forest-100/60 px-3.5 py-3">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-600" />
            <div>
              <p className="text-[11px] font-semibold text-forest-900">Your request is ready as a demo</p>
              <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
                For a real buyback, contact us on WhatsApp with your order number and photos of the book.
              </p>
            </div>
          </div>
        ) : (
          <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
            <p className="text-[9px] text-muted">Works for books with a purchase price up to ৳20,000.</p>
            <Button type="button" size="sm" disabled={!eligible} onClick={() => setSubmitted(true)}>
              Request buyback
              <ArrowRight size={13} />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
