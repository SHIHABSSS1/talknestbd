"use client";

import { useState } from "react";
import {
  ArrowRight,
  Building2,
  CheckCircle2,
  ClipboardList,
  Mail,
  Phone,
  Send,
  Store,
  UserRound,
} from "lucide-react";
import { cn, toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

interface WholesaleValues {
  organization: string;
  contact: string;
  phone: string;
  email: string;
  city: string;
  quantity: string;
  message: string;
}

const emptyValues: WholesaleValues = {
  organization: "",
  contact: "",
  phone: "",
  email: "",
  city: "",
  quantity: "১০–২৫ কপি",
  message: "",
};

export function WholesaleForm() {
  const [values, setValues] = useState<WholesaleValues>(emptyValues);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [reference, setReference] = useState<string | null>(null);

  const update = (patch: Partial<WholesaleValues>) =>
    setValues((previous) => ({ ...previous, ...patch }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (values.organization.trim().length < 2) next.organization = "প্রতিষ্ঠানের নাম লিখুন";
    if (values.contact.trim().length < 3) next.contact = "যোগাযোগকারীর নাম লিখুন";
    if (values.phone.replace(/\D/g, "").length < 11) next.phone = "১১ ডিজিটের মোবাইল নম্বর দিন";
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) next.email = "সঠিক ইমেইল দিন";
    if (!values.city.trim()) next.city = "শহর বা জেলার নাম লিখুন";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    const random = Math.floor(1000 + Math.random() * 9000);
    setReference(`TN-WS-${random}`);
  };

  if (reference) {
    return (
      <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-6 text-center sm:p-9">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-100 text-forest-700">
          <CheckCircle2 size={26} />
        </span>
        <p className="mt-4 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
          Wholesale Request Received
        </p>
        <h2 className="mt-1.5 font-display text-2xl font-bold text-forest-950">
          ধন্যবাদ, আপনার পাইকারি আবেদন জমা হয়েছে
        </h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
          আমাদের পাইকারি টিম ১ কর্মদিবসের মধ্যে ফোন বা ইমেইলে যোগাযোগ করে কোটেশন
          ও স্টক জানাবে। ডেমো রেফারেন্স নম্বরটি নিচে সংরক্ষণ করুন।
        </p>
        <p className="mx-auto mt-4 w-fit rounded-full bg-forest-900 px-5 py-2 font-display text-sm font-bold tracking-wider text-gold-300">
          {reference}
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button type="button" variant="outline" onClick={() => { setReference(null); setValues(emptyValues); }}>
            নতুন আবেদন
          </Button>
          <Button href="/books" variant="primary">
            বই ঘুরে দেখুন
            <ArrowRight size={14} />
          </Button>
        </div>
        <p className="mt-4 text-[9px] text-muted">
          এটি একটি ডেমো ফর্ম — কোনো তথ্য সার্ভারে পাঠানো হয়নি।
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      noValidate
      className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-7"
    >
      <div className="flex items-start gap-3">
        <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-900 text-gold-300">
          <Store size={19} />
        </span>
        <div>
          <h2 className="font-display text-xl font-bold text-forest-950">
            পাইকারি অর্ডারের আবেদন
          </h2>
          <p className="mt-0.5 text-[11px] leading-relaxed text-muted">
            লাইব্রেরি, স্কুল, মসজিদ, ক্লাব বা প্রতিষ্ঠানের জন্য কমপক্ষে ১০ কপির
            অর্ডারে বিশেষ দাম। ফর্মটি পূরণ করুন, আমরা কোটেশন পাঠাব।
          </p>
        </div>
      </div>

      <div className="mt-5 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
            <Building2 size={12} /> প্রতিষ্ঠানের নাম <span className="text-clay-500">*</span>
          </span>
          <input
            value={values.organization}
            onChange={(event) => update({ organization: event.target.value })}
            placeholder="যেমন: আলোকিত পাঠাগার"
            className={cn(inputClass, errors.organization && "border-clay-500/70")}
          />
          {errors.organization && <span className="mt-1 block text-[10px] text-clay-600">{errors.organization}</span>}
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
            <UserRound size={12} /> যোগাযোগকারী <span className="text-clay-500">*</span>
          </span>
          <input
            value={values.contact}
            onChange={(event) => update({ contact: event.target.value })}
            placeholder="আপনার নাম"
            autoComplete="name"
            className={cn(inputClass, errors.contact && "border-clay-500/70")}
          />
          {errors.contact && <span className="mt-1 block text-[10px] text-clay-600">{errors.contact}</span>}
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
            <Phone size={12} /> মোবাইল নম্বর <span className="text-clay-500">*</span>
          </span>
          <input
            value={values.phone}
            onChange={(event) => update({ phone: event.target.value })}
            placeholder="+880 1XXXXXXXXX"
            autoComplete="tel"
            inputMode="tel"
            className={cn(inputClass, errors.phone && "border-clay-500/70")}
          />
          {errors.phone && <span className="mt-1 block text-[10px] text-clay-600">{errors.phone}</span>}
        </label>

        <label className="block">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
            <Mail size={12} /> ইমেইল <span className="font-normal text-muted">(ঐচ্ছিক)</span>
          </span>
          <input
            type="email"
            value={values.email}
            onChange={(event) => update({ email: event.target.value })}
            placeholder="library@example.com"
            autoComplete="email"
            className={cn(inputClass, errors.email && "border-clay-500/70")}
          />
          {errors.email && <span className="mt-1 block text-[10px] text-clay-600">{errors.email}</span>}
        </label>

        <label className="block">
          <span className="mb-1 text-[11px] font-semibold text-forest-900">
            শহর / জেলা <span className="text-clay-500">*</span>
          </span>
          <input
            value={values.city}
            onChange={(event) => update({ city: event.target.value })}
            placeholder="যেমন: ঢাকা"
            className={cn(inputClass, errors.city && "border-clay-500/70")}
          />
          {errors.city && <span className="mt-1 block text-[10px] text-clay-600">{errors.city}</span>}
        </label>

        <label className="block">
          <span className="mb-1 text-[11px] font-semibold text-forest-900">
            আনুমানিক পরিমাণ
          </span>
          <select
            value={values.quantity}
            onChange={(event) => update({ quantity: event.target.value })}
            className={inputClass}
          >
            {["১০–২৫ কপি", "২৬–৫০ কপি", "৫১–১০০ কপি", "১০০+ কপি"].map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="block sm:col-span-2">
          <span className="mb-1 text-[11px] font-semibold text-forest-900">
            কী ধরনের বই দরকার?
          </span>
          <textarea
            value={values.message}
            onChange={(event) => update({ message: event.target.value })}
            rows={3}
            placeholder="যেমন: ক্লাস ৬–১০-এর জন্য ৫০টি ইসলামিক গল্পের বই, অথবা ৩০টি উপন্যাস..."
            className="w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-3 text-[13px] leading-relaxed text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
          />
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/8 pt-4">
        <p className="flex items-center gap-1.5 text-[9px] text-muted">
          <ClipboardList size={11} />
          ডেমো ফর্ম · ৳{toBn(999)}+ অর্ডারে ফ্রি ডেলিভারি
        </p>
        <Button type="submit" size="sm">
          <Send size={13} />
          কোটেশনের আবেদন করুন
        </Button>
      </div>
    </form>
  );
}
