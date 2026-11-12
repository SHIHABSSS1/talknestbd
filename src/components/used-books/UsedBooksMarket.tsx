"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  MapPin,
  MessageCircle,
  Recycle,
  Search,
  Sparkles,
  Upload,
  UserRound,
} from "lucide-react";
import type { UsedBook } from "@/lib/types";
import { usedBooks } from "@/data/community";
import { cn, formatPrice, toBn } from "@/lib/utils";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/Button";

const conditionFilters = ["All", "Like new", "Very good", "Good"] as const;

export function UsedBooksMarket() {
  const [condition, setCondition] = useState<(typeof conditionFilters)[number]>("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<UsedBook | null>(null);

  const filtered = useMemo(() => {
    return usedBooks.filter((book) => {
      const matchesCondition = condition === "All" || book.condition === condition;
      const haystack = `${book.title} ${book.author} ${book.seller} ${book.location}`.toLowerCase();
      const matchesQuery = query.trim() === "" || haystack.includes(query.trim().toLowerCase());
      return matchesCondition && matchesQuery;
    });
  }, [condition, query]);

  return (
    <>
      <section>
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
              <span className="h-px w-5 bg-clay-500/50" /> Pre-loved Books
            </span>
            <h2 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
              Books from reader to reader
            </h2>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-3 py-1.5 text-[9px] font-semibold text-forest-700">
              <Recycle size={11} /> {toBn(usedBooks.length)} books available now
            </span>
          </div>
        </div>

        <div className="mt-4 flex flex-col gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search size={15} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/45" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search books, authors or sellers..."
              className="h-10 w-full rounded-full border border-forest-900/10 bg-cream-100/50 pl-10 pr-4 text-[12px] text-forest-950 placeholder:text-muted/60 focus:border-forest-700/30 focus:bg-cream-50 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            />
          </div>
          <div className="no-scrollbar flex gap-1.5 overflow-x-auto">
            {conditionFilters.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setCondition(item)}
                className={cn(
                  "shrink-0 rounded-full border px-3 py-1.5 text-[10px] font-medium transition-colors",
                  condition === item
                    ? "border-forest-900 bg-forest-900 text-cream-50"
                    : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
                )}
              >
                {item}
              </button>
            ))}
          </div>
        </div>

        {filtered.length > 0 ? (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {filtered.map((book) => (
              <article
                key={book.id}
                className="group flex flex-col overflow-hidden rounded-2xl border border-forest-900/8 bg-cream-50"
              >
                <button
                  type="button"
                  onClick={() => setSelected(book)}
                  className="relative block aspect-[3/4] overflow-hidden bg-cream-100 p-2 text-left"
                  aria-label={`${book.title} — view details`}
                >
                  <span className="block h-full w-full overflow-hidden rounded-lg transition-transform duration-500 group-hover:-translate-y-1">
                    <BookCover
                      book={{
                        title: book.title,
                        author: book.author,
                        publisher: "Used book",
                        cover: book.cover,
                      }}
                      size="sm"
                    />
                  </span>
                  <span className="absolute left-3.5 top-3.5 rounded-full bg-forest-950/85 px-2 py-0.5 text-[8px] font-semibold text-gold-300 backdrop-blur">
                    {book.condition}
                  </span>
                  <span className="absolute right-3.5 top-3.5 rounded-full bg-cream-50/95 px-2 py-0.5 text-[8px] font-bold text-clay-600">
                    50% off
                  </span>
                </button>
                <div className="flex flex-1 flex-col p-3">
                  <h3 className="line-clamp-1 text-[11px] font-semibold text-forest-950">{book.title}</h3>
                  <p className="text-[9px] text-muted">{book.author}</p>
                  <div className="mt-2 flex items-baseline gap-1.5">
                    <span className="font-display text-base font-bold text-forest-950">{formatPrice(book.price)}</span>
                    <span className="text-[9px] text-muted line-through">{formatPrice(book.originalPrice)}</span>
                  </div>
                  <div className="mt-2 flex items-center gap-1 border-t border-forest-900/8 pt-2 text-[8px] text-muted">
                    <MapPin size={9} className="shrink-0" />
                    <span className="line-clamp-1">{book.location}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelected(book)}
                    className="mt-2 inline-flex h-8 items-center justify-center gap-1 rounded-full bg-forest-900 text-[9px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
                  >
                    View details
                  </button>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="mt-4 rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/40 px-6 py-12 text-center">
            <Search size={24} className="mx-auto text-forest-900/25" />
            <p className="mt-2 text-sm font-semibold text-forest-900">No books found</p>
            <p className="mt-1 text-[10px] text-muted">Try a different search or change the filter.</p>
          </div>
        )}
      </section>

      {selected && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <button
            type="button"
            aria-label="Close"
            onClick={() => setSelected(null)}
            className="absolute inset-0 h-full w-full bg-forest-950/75 backdrop-blur-sm"
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-label={selected.title}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-cream-50 shadow-2xl"
          >
            <div className="flex gap-4 border-b border-forest-900/8 bg-cream-100/50 p-5">
              <div className="h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-100">
                <BookCover
                  book={{
                    title: selected.title,
                    author: selected.author,
                    publisher: "Used book",
                    cover: selected.cover,
                  }}
                  size="sm"
                />
              </div>
              <div className="min-w-0">
                <span className="rounded-full bg-forest-900 px-2 py-0.5 text-[8px] font-semibold text-gold-300">
                  {selected.condition}
                </span>
                <h3 className="mt-1.5 font-display text-lg font-bold leading-snug text-forest-950">
                  {selected.title}
                </h3>
                <p className="text-[10px] text-muted">{selected.author}</p>
                <div className="mt-1.5 flex items-baseline gap-2">
                  <span className="font-display text-xl font-bold text-forest-950">{formatPrice(selected.price)}</span>
                  <span className="text-[10px] text-muted line-through">{formatPrice(selected.originalPrice)}</span>
                  <span className="rounded-full bg-clay-500/10 px-1.5 py-0.5 text-[8px] font-semibold text-clay-600">
                    {toBn(Math.round(((selected.originalPrice - selected.price) / selected.originalPrice) * 100))}% saved
                  </span>
                </div>
              </div>
            </div>
            <div className="space-y-2.5 p-5">
              <p className="flex items-center gap-2 text-[10px] text-forest-800">
                <UserRound size={12} className="text-forest-600" /> Seller: {selected.seller}
              </p>
              <p className="flex items-center gap-2 text-[10px] text-forest-800">
                <MapPin size={12} className="text-forest-600" /> {selected.location}
              </p>
              <p className="rounded-xl bg-forest-50 px-3 py-2.5 text-[9px] leading-relaxed text-forest-800/70">
                You can inspect the book in person before buying. On this demo
                site, the seller&apos;s contact details are shared after an order
                is confirmed.
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Button
                  href={`https://wa.me/8801712345678?text=${encodeURIComponent(`I'd like to buy this used copy of ${selected.title}`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  size="sm"
                >
                  <MessageCircle size={13} /> I want to buy
                </Button>
                <Button type="button" variant="outline" size="sm" onClick={() => setSelected(null)}>
                  Save for later
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export function UsedBookSellForm() {
  const [form, setForm] = useState({
    title: "",
    author: "",
    condition: "Good",
    expected: "",
    seller: "",
    location: "",
    contact: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [done, setDone] = useState(false);

  const update = (patch: Partial<typeof form>) => setForm((previous) => ({ ...previous, ...patch }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.title.trim().length < 2) next.title = "Enter the book title";
    if (form.author.trim().length < 2) next.author = "Enter the author's name";
    if (form.seller.trim().length < 3) next.seller = "Enter your name";
    if (form.location.trim().length < 2) next.location = "Enter your area or city";
    if (form.contact.replace(/\D/g, "").length < 11) next.contact = "Enter an 11-digit mobile number";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setDone(true);
  };

  const inputClass =
    "h-10 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3 text-[12px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  if (done) {
    return (
      <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-6 text-center">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
          <CheckCircle2 size={22} />
        </span>
        <h3 className="mt-3 font-display text-lg font-bold text-forest-950">Your book details have been submitted</h3>
        <p className="mx-auto mt-1.5 max-w-xs text-[10px] leading-relaxed text-muted">
          Our team will review the book&apos;s photos and condition, then get in
          touch. This demo site does not send any information to a server.
        </p>
        <button
          type="button"
          onClick={() => {
            setDone(false);
            setForm({ title: "", author: "", condition: "Good", expected: "", seller: "", location: "", contact: "" });
          }}
          className="mt-3 text-[10px] font-semibold text-clay-600 hover:text-clay-500"
        >
          Add another book
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
      <div className="flex items-center gap-2.5">
        <span className="grid h-9 w-9 place-items-center rounded-xl bg-clay-500/10 text-clay-600">
          <Upload size={16} />
        </span>
        <div>
          <h3 className="font-display text-base font-bold text-forest-950">Sell your own books</h3>
          <p className="text-[9px] text-muted">Tell us about the book — we&apos;ll review it and get back to you</p>
        </div>
      </div>

      <div className="mt-4 space-y-2.5">
        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold text-forest-900">Book title</span>
          <input value={form.title} onChange={(event) => update({ title: event.target.value })} placeholder="e.g. A Journey Through Blue Clouds" className={cn(inputClass, errors.title && "border-clay-500/70")} />
          {errors.title && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.title}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold text-forest-900">Author</span>
          <input value={form.author} onChange={(event) => update({ author: event.target.value })} placeholder="Author's name" className={cn(inputClass, errors.author && "border-clay-500/70")} />
          {errors.author && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.author}</span>}
        </label>
        <div className="grid grid-cols-2 gap-2.5">
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold text-forest-900">Condition</span>
            <select value={form.condition} onChange={(event) => update({ condition: event.target.value })} className={inputClass}>
              {["Like new", "Very good", "Good", "Readable"].map((item) => <option key={item}>{item}</option>)}
            </select>
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold text-forest-900">Expected price (৳)</span>
            <input value={form.expected} onChange={(event) => update({ expected: event.target.value })} inputMode="numeric" placeholder="250" className={inputClass} />
          </label>
        </div>
        <div className="grid grid-cols-2 gap-2.5">
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold text-forest-900">Your name</span>
            <input value={form.seller} onChange={(event) => update({ seller: event.target.value })} placeholder="Name" className={cn(inputClass, errors.seller && "border-clay-500/70")} />
            {errors.seller && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.seller}</span>}
          </label>
          <label className="block">
            <span className="mb-1 block text-[10px] font-semibold text-forest-900">Area</span>
            <input value={form.location} onChange={(event) => update({ location: event.target.value })} placeholder="Dhaka" className={cn(inputClass, errors.location && "border-clay-500/70")} />
            {errors.location && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.location}</span>}
          </label>
        </div>
        <label className="block">
          <span className="mb-1 block text-[10px] font-semibold text-forest-900">Mobile number</span>
          <input value={form.contact} onChange={(event) => update({ contact: event.target.value })} inputMode="tel" placeholder="+880 1XXXXXXXXX" className={cn(inputClass, errors.contact && "border-clay-500/70")} />
          {errors.contact && <span className="mt-0.5 block text-[9px] text-clay-600">{errors.contact}</span>}
        </label>
        <div className="rounded-xl border border-dashed border-forest-900/15 bg-cream-100/50 px-3 py-3 text-center">
          <BookOpen size={16} className="mx-auto text-forest-900/25" />
          <p className="mt-1 text-[9px] text-muted">
            Photo upload isn&apos;t available in this demo — you&apos;ll share book photos when we contact you.
          </p>
        </div>
        <Button type="submit" size="sm" className="w-full">
          <Sparkles size={13} /> List my book for sale
        </Button>
        <p className="text-center text-[8px] text-muted">Demo form · No real transaction takes place</p>
      </div>
    </form>
  );
}
