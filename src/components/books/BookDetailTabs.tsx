"use client";

import { useState } from "react";
import { BookOpen, CheckCircle2, ChevronDown, Layers3, Tag } from "lucide-react";
import type { Book } from "@/lib/types";
import { categoryLabel } from "@/data/categories";
import { cn, toBn } from "@/lib/utils";

const tabs = [
  { key: "description", label: "সংক্ষিপ্ত ও বিস্তারিত বিবরণ" },
  { key: "details", label: "স্পেসিফিকেশন" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

export function BookDetailTabs({ book }: { book: Book }) {
  const [active, setActive] = useState<TabKey>("description");

  return (
    <div className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
      <div className="no-scrollbar flex gap-1 overflow-x-auto border-b border-forest-900/8 bg-cream-100/60 px-3 pt-3 sm:px-5">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActive(tab.key)}
            className={cn(
              "shrink-0 rounded-t-xl px-4 py-2.5 text-xs font-semibold transition-colors sm:text-[13px]",
              active === tab.key
                ? "bg-cream-50 text-forest-950"
                : "text-muted hover:text-forest-900",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-5 sm:p-8">
        {active === "description" && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-100 text-forest-700">
                <BookOpen size={15} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-forest-950">সংক্ষিপ্ত বিবরণ</h3>
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted">Short description</p>
              </div>
            </div>
            <p className="mt-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 p-4 text-sm font-medium leading-relaxed text-forest-900/85 sm:text-[15px]">
              {book.description}
            </p>

            <div className="mt-7">
              <div className="flex items-center gap-2">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-500/15 text-gold-600">
                  <Layers3 size={15} />
                </span>
                <div>
                  <h3 className="font-display text-lg font-bold text-forest-950">বিস্তারিত বিবরণ</h3>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted">Long description</p>
                </div>
              </div>
              <div className="prose-bn mt-3 space-y-3 text-sm leading-relaxed text-forest-900/75 sm:text-[15px]">
                {book.longDescription.map((paragraph) => (
                  <p key={paragraph.slice(0, 30)}>{paragraph}</p>
                ))}
              </div>
            </div>

            <div className="mt-7">
              <h3 className="font-display text-lg font-bold text-forest-950">
                এই বইয়ের বিশেষত্ব
              </h3>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {book.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2.5 rounded-xl bg-cream-100/70 px-3.5 py-3 text-xs leading-relaxed text-forest-800"
                  >
                    <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-forest-600" />
                    {highlight}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {active === "details" && (
          <div>
            <div className="flex items-center justify-between gap-3">
              <h3 className="font-display text-lg font-bold text-forest-950">বইয়ের স্পেসিফিকেশন</h3>
              <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                <ChevronDown size={12} /> বিস্তারিত তথ্য
              </span>
            </div>
            <div className="mt-4 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                ["লেখক", book.author],
                ["প্রকাশনী", book.publisher],
                ["ক্যাটাগরি", categoryLabel(book.category)],
                ["পৃষ্ঠা সংখ্যা", toBn(book.pages)],
                ["ভাষা", book.language],
                ["বাঁধাই", book.binding],
                ["প্রকাশের বছর", toBn(book.publishedYear)],
                ["আইএসবিএন", "978-984-0000-00-0"],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex items-center justify-between gap-4 rounded-xl border border-forest-900/8 bg-cream-100/30 px-4 py-3 text-xs"
                >
                  <span className="flex items-center gap-1.5 text-muted">
                    <Tag size={11} />
                    {label}
                  </span>
                  <span className="text-right font-semibold text-forest-900">{value}</span>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-2xl border border-dashed border-forest-500/25 bg-forest-50 px-4 py-3 text-[10px] leading-relaxed text-forest-800/70">
              বইটি ১০০% অরিজিনাল। প্রকাশকের কাছ থেকে সরাসরি সংগ্রহ করা হয় এবং
              ডেলিভারির আগে প্রতিটি কপি যাচাই করা হয়।
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
