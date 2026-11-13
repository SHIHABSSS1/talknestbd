"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  ChevronDown,
  Globe2,
  Layers3,
  Lock,
  MessageCircle,
  PackageCheck,
  RefreshCcw,
  Share2,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import type { Book } from "@/lib/types";
import { categoryLabel } from "@/data/categories";
import { siteConfig } from "@/lib/utils";
import { cn, toBn } from "@/lib/utils";
import { BookDeliveryInfo } from "./BookDeliveryInfo";
import { BookReviews } from "./BookReviews";
import {
  FacebookIcon,
  WhatsAppIcon,
  YouTubeIcon,
} from "@/components/layout/SocialLinks";

const tabs = [
  { key: "description", label: "Overview" },
  { key: "details", label: "Specifications" },
  { key: "delivery", label: "Delivery" },
  { key: "reviews", label: "Reviews" },
  { key: "returns", label: "Return policy" },
  { key: "privacy", label: "Privacy" },
  { key: "social", label: "Social" },
] as const;

type TabKey = (typeof tabs)[number]["key"];

const privacyHighlights = [
  "Your name, number, address and cart stay in your own browser.",
  "We share only what a courier needs: name, phone and delivery address.",
  "No selling of reader information, and no daily marketing spam.",
  "You can ask us to delete your data at any time.",
];

const returnHighlights = [
  "Request a return or exchange within 7 days of delivery.",
  "Printing faults, wrong title or transit damage are always accepted.",
  "Approved refunds are processed within 3–7 working days.",
  "Finished books can be returned for 50% back through our buyback service.",
];

export function BookDetailTabs({ book }: { book: Book }) {
  const [active, setActive] = useState<TabKey>("description");

  /**
   * The rating card links straight to #book-reviews, so open the reviews tab
   * whenever that anchor is present in the URL.
   */
  useEffect(() => {
    const openFromHash = () => {
      if (window.location.hash === "#book-reviews") setActive("reviews");
    };
    openFromHash();
    window.addEventListener("hashchange", openFromHash);
    return () => window.removeEventListener("hashchange", openFromHash);
  }, []);

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
                <h3 className="font-display text-lg font-bold text-forest-950">Short description</h3>
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted">At a glance</p>
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
                  <h3 className="font-display text-lg font-bold text-forest-950">Full description</h3>
                  <p className="text-[9px] uppercase tracking-[0.16em] text-muted">In detail</p>
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
                Why readers love this book
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
              <h3 className="font-display text-lg font-bold text-forest-950">Book specifications</h3>
              <span className="inline-flex items-center gap-1 text-[10px] text-muted">
                <ChevronDown size={12} /> Full details
              </span>
            </div>
            <div className="mt-4 grid max-w-3xl gap-2 sm:grid-cols-2">
              {[
                ["Author", book.author],
                ["Publisher", book.publisher],
                ["Category", categoryLabel(book.category)],
                ["Pages", toBn(book.pages)],
                ["Language", book.language],
                ["Binding", book.binding],
                ["Published", toBn(book.publishedYear)],
                ["ISBN", "978-984-0000-00-0"],
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
              This is a 100% original edition. Each copy is sourced directly
              from the publisher and checked before delivery.
            </div>
          </div>
        )}

        {active === "delivery" && <BookDeliveryInfo />}

        {active === "reviews" && (
          <div>
            <BookReviews book={book} />
          </div>
        )}

        {active === "returns" && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-100 text-forest-700">
                <RefreshCcw size={15} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-forest-950">
                  Return &amp; refund policy
                </h3>
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                  For this book
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {returnHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl border border-forest-900/8 bg-cream-100/60 px-3.5 py-3 text-xs leading-relaxed text-forest-800"
                >
                  <CheckCircle2 size={15} className="mt-0.5 shrink-0 text-forest-600" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/return-policy"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-forest-900 px-4 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
              >
                Read the full return policy
              </Link>
              <Link
                href="/buyback"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-forest-900/15 px-4 text-[11px] font-semibold text-forest-800 transition-colors hover:border-forest-900"
              >
                50% buyback after reading
              </Link>
            </div>
          </div>
        )}

        {active === "privacy" && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-100 text-forest-700">
                <ShieldCheck size={15} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-forest-950">
                  Privacy, in plain words
                </h3>
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                  Last updated 1 November 2026
                </p>
              </div>
            </div>
            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              {privacyHighlights.map((item) => (
                <div
                  key={item}
                  className="flex items-start gap-2.5 rounded-xl border border-forest-900/8 bg-cream-100/60 px-3.5 py-3 text-xs leading-relaxed text-forest-800"
                >
                  <Lock size={15} className="mt-0.5 shrink-0 text-forest-600" />
                  {item}
                </div>
              ))}
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2.5">
              <Link
                href="/privacy"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-forest-900 px-4 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
              >
                Read the full privacy policy
              </Link>
              <Link
                href="/terms"
                className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full border border-forest-900/15 px-4 text-[11px] font-semibold text-forest-800 transition-colors hover:border-forest-900"
              >
                Terms of use
              </Link>
            </div>
          </div>
        )}

        {active === "social" && (
          <div className="max-w-3xl">
            <div className="flex items-center gap-2">
              <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-100 text-forest-700">
                <Share2 size={15} />
              </span>
              <div>
                <h3 className="font-display text-lg font-bold text-forest-950">
                  Join the TalkNest community
                </h3>
                <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
                  Talk to us, share your reading
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-3">
              <a
                href={siteConfig.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/60 p-4 transition-colors hover:border-forest-900/25"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#25D366] text-white">
                  <WhatsAppIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold text-forest-950">
                    WhatsApp
                  </span>
                  <span className="block text-[10px] text-muted">
                    Fastest reply, 10am–8pm
                  </span>
                </span>
              </a>
              <a
                href={siteConfig.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/60 p-4 transition-colors hover:border-forest-900/25"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-clay-600 text-white">
                  <FacebookIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold text-forest-950">
                    Facebook
                  </span>
                  <span className="block text-[10px] text-muted">
                    Offers and reader posts
                  </span>
                </span>
              </a>
              <a
                href={siteConfig.youtube}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/60 p-4 transition-colors hover:border-forest-900/25"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50">
                  <YouTubeIcon size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[12px] font-semibold text-forest-950">
                    YouTube
                  </span>
                  <span className="block text-[10px] text-muted">
                    Book talks and videos
                  </span>
                </span>
              </a>
            </div>

            <div className="mt-4 grid gap-2.5 sm:grid-cols-2">
              <Link
                href="/contact"
                className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3.5 text-xs font-semibold text-forest-900 transition-colors hover:border-forest-900/25"
              >
                <MessageCircle size={16} className="text-clay-500" />
                Live chat with the team
              </Link>
              <Link
                href="/stories/share"
                className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3.5 text-xs font-semibold text-forest-900 transition-colors hover:border-forest-900/25"
              >
                <Globe2 size={16} className="text-clay-500" />
                Share your reader story
              </Link>
              <Link
                href="/reviews#review-form"
                className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3.5 text-xs font-semibold text-forest-900 transition-colors hover:border-forest-900/25"
              >
                <PackageCheck size={16} className="text-clay-500" />
                Write a review for this book
              </Link>
              <Link
                href="/free-order"
                className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3.5 text-xs font-semibold text-forest-900 transition-colors hover:border-forest-900/25"
              >
                <Truck size={16} className="text-clay-500" />
                Free delivery over ৳999
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
