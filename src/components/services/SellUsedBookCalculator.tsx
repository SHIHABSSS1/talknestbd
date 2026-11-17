"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Banknote,
  Calculator,
  CheckCircle2,
  Info,
  LogIn,
  Repeat2,
} from "lucide-react";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { useSellContent } from "@/components/providers/SellContentProvider";
import { useSellRequests } from "@/components/providers/SellRequestsProvider";
import { readAddresses, readProfile } from "@/lib/orders";
import { formatPrice, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import type { SellRequest } from "@/lib/sell-requests";

const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3 text-[12px] text-forest-950 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function SellUsedBookCalculator() {
  const { books: allBooks } = useBookContent();
  const { content } = useSellContent();
  const calculator = content.calculator;
  const { add } = useSellRequests();

  const [bookSlug, setBookSlug] = useState(allBooks[0]?.slug ?? "");
  const [purchasePrice, setPurchasePrice] = useState(String(allBooks[0]?.price ?? 380));
  const [conditionId, setConditionId] = useState(calculator.conditions[0]?.id ?? "");
  const [showForm, setShowForm] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [formError, setFormError] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", email: "", address: "" });
  const [submitted, setSubmitted] = useState(false);

  const selectedBook = allBooks.find((book) => book.slug === bookSlug);
  const activeCondition =
    calculator.conditions.find((entry) => entry.id === conditionId) ??
    calculator.conditions[0];
  const price = Number(purchasePrice.replace(/[^\d]/g, "")) || 0;
  const amount = Math.round((price * (activeCondition?.rate ?? 0)) / 100);
  const percent = useMemo(() => activeCondition?.rate ?? 0, [activeCondition]);
  const rate = percent;
  const eligible = price > 0 && price <= calculator.cap;

  const setField = (key: keyof typeof form, value: string) => {
    setForm((current) => ({ ...current, [key]: value }));
    setFormError("");
  };

  const loginWithProfile = () => {
    const profile = readProfile();
    const saved = readAddresses();
    const defaultAddress = saved.find((entry) => entry.isDefault) ?? saved[0];
    setForm({
      name: defaultAddress?.name || profile.name,
      phone: defaultAddress?.phone || profile.phone,
      email: defaultAddress?.email || profile.email,
      address: defaultAddress
        ? [
            defaultAddress.street,
            defaultAddress.area,
            defaultAddress.district,
            defaultAddress.division,
            defaultAddress.postcode,
          ]
            .filter(Boolean)
            .join(", ")
        : profile.city || "",
    });
    setLoggedIn(true);
    setFormError("");
  };

  const submitRequest = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.address.trim()) {
      setFormError("Please enter your name, phone number and address.");
      return;
    }
    const request: SellRequest = {
      id: `sell-${Date.now()}`,
      createdAt: new Date().toISOString(),
      name: form.name.trim(),
      phone: form.phone.trim(),
      email: form.email.trim(),
      address: form.address.trim(),
      bookTitle: selectedBook?.title ?? "—",
      purchasePrice: price,
      condition: activeCondition?.label ?? "—",
      rate,
      amount,
      status: "New",
    };
    add(request);
    setShowForm(false);
    setSubmitted(true);
  };

  return (
    <div id="calculator" className="scroll-mt-[88px] overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
      <div className="border-b border-forest-900/8 bg-cream-100/50 px-5 py-4 sm:px-6">
        <div className="flex items-center gap-2">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-900 text-gold-300">
            <Calculator size={16} />
          </span>
          <div>
            <h2 className="font-display text-lg font-bold text-forest-950">
              {calculator.heading}
            </h2>
            <p className="text-[9px] text-muted">{calculator.subheading}</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-6">
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">
              Choose a book
            </span>
            <select
              value={bookSlug}
              onChange={(event) => {
                const next = event.target.value;
                setBookSlug(next);
                const book = allBooks.find((entry) => entry.slug === next);
                if (book) setPurchasePrice(String(book.price));
              }}
              className={inputClass}
            >
              {allBooks.slice(0, 18).map((book) => (
                <option key={book.slug} value={book.slug}>
                  {book.title}
                </option>
              ))}
            </select>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">
              Purchase price (৳)
            </span>
            <input
              value={purchasePrice}
              onChange={(event) => setPurchasePrice(event.target.value)}
              inputMode="numeric"
              placeholder="e.g. 380"
              className={inputClass}
            />
            {selectedBook && (
              <span className="mt-1 block text-[9px] text-muted">
                Current price of {selectedBook.title}: {formatPrice(selectedBook.price)}
              </span>
            )}
          </label>
        </div>

        <div className="mt-3">
          <span className="mb-1.5 block text-[11px] font-semibold text-forest-900">
            Book condition
          </span>
          <div className="grid gap-2 sm:grid-cols-3">
            {calculator.conditions.map((entry) => (
              <button
                key={entry.id}
                type="button"
                onClick={() => setConditionId(entry.id)}
                className={
                  conditionId === entry.id
                    ? "rounded-xl border border-forest-800 bg-forest-900 px-3 py-2.5 text-left text-cream-50"
                    : "rounded-xl border border-forest-900/12 bg-cream-50 px-3 py-2.5 text-left text-forest-900 transition-colors hover:border-forest-900/30"
                }
              >
                <span className="flex items-center justify-between gap-1 text-[11px] font-semibold">
                  {entry.label}
                  <span className={conditionId === entry.id ? "text-gold-300" : "text-clay-600"}>
                    {toBn(entry.rate)}%
                  </span>
                </span>
                <span
                  className={
                    conditionId === entry.id
                      ? "mt-0.5 block text-[8px] text-cream-100/50"
                      : "mt-0.5 block text-[8px] text-muted"
                  }
                >
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
                <Banknote size={12} /> Estimated selling value
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
              {activeCondition?.label}
            </span>
          </div>
        </div>

        <div className="mt-3 flex items-start gap-2 rounded-xl bg-gold-500/8 px-3 py-2.5 text-[9px] leading-relaxed text-forest-800/70">
          <Info size={12} className="mt-0.5 shrink-0 text-gold-600" />
          {calculator.disclaimer}
        </div>

        {showForm && (
          <div className="mt-3 rounded-xl border border-forest-900/12 bg-white p-4">
            <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[11px] font-semibold text-forest-900">Your details</p>
              <button
                type="button"
                onClick={loginWithProfile}
                className="inline-flex h-8 items-center gap-1.5 rounded-full border border-forest-900/15 px-3 text-[10px] font-semibold text-forest-800 hover:bg-forest-50"
              >
                <LogIn size={12} />
                {loggedIn ? "Saved profile applied" : "Log in with saved profile"}
              </button>
            </div>
            {loggedIn && (
              <p className="mb-2 flex items-center gap-1.5 rounded-lg bg-forest-50 px-2.5 py-2 text-[9px] text-forest-800">
                <CheckCircle2 size={11} className="text-forest-600" />
                Logged in as {form.name || "reader"} — edit anything below, especially the
                address if it was missing.
              </p>
            )}
            <div className="grid gap-2 sm:grid-cols-2">
              <label className="block">
                <span className="mb-1 block text-[9px] font-semibold text-forest-900">Name</span>
                <input
                  value={form.name}
                  onChange={(event) => setField("name", event.target.value)}
                  placeholder="Full name"
                  className={inputClass}
                />
              </label>
              <label className="block">
                <span className="mb-1 block text-[9px] font-semibold text-forest-900">Phone</span>
                <input
                  value={form.phone}
                  onChange={(event) => setField("phone", event.target.value)}
                  placeholder="01XXX-XXXXXX"
                  className={inputClass}
                />
              </label>
            </div>
            <label className="mt-2 block">
              <span className="mb-1 block text-[9px] font-semibold text-forest-900">Email (optional)</span>
              <input
                value={form.email}
                onChange={(event) => setField("email", event.target.value)}
                placeholder="you@example.com"
                className={inputClass}
              />
            </label>
            <label className="mt-2 block">
              <span className="mb-1 block text-[9px] font-semibold text-forest-900">Address</span>
              <textarea
                value={form.address}
                onChange={(event) => setField("address", event.target.value)}
                rows={2}
                placeholder="Street, area, district, city"
                className="w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3 py-2 text-[12px] text-forest-950 focus:border-forest-700/40 focus:outline-none"
              />
            </label>
            {formError && (
              <p className="mt-2 text-[9px] font-medium text-clay-600">{formError}</p>
            )}
            <div className="mt-3 flex flex-wrap gap-2">
              <Button type="button" size="sm" onClick={submitRequest}>
                Submit request
                <ArrowRight size={13} />
              </Button>
              <Button
                type="button"
                size="sm"
                variant="outline"
                onClick={() => {
                  setShowForm(false);
                  setFormError("");
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        )}

        {submitted ? (
          <div className="mt-3 flex items-start gap-2.5 rounded-xl border border-forest-500/20 bg-forest-100/60 px-3.5 py-3">
            <CheckCircle2 size={16} className="mt-0.5 shrink-0 text-forest-600" />
            <div>
              <p className="text-[11px] font-semibold text-forest-900">
                {calculator.successTitle}
              </p>
              <p className="mt-0.5 text-[9px] leading-relaxed text-muted">
                {calculator.successText}
              </p>
            </div>
          </div>
        ) : (
          !showForm && (
            <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
              <p className="text-[9px] text-muted">{calculator.eligibilityNote}</p>
              <Button
                type="button"
                size="sm"
                disabled={!eligible}
                onClick={() => {
                  setSubmitted(false);
                  setShowForm(true);
                }}
              >
                {calculator.submitLabel}
                <ArrowRight size={13} />
              </Button>
            </div>
          )
        )}
      </div>
    </div>
  );
}
