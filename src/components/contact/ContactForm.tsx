"use client";

import { useState } from "react";
import {
  CheckCircle2,
  MessageSquareText,
  Send,
  ShoppingBag,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const subjects = [
  "সাধারণ জিজ্ঞাসা",
  "অর্ডার সংক্রান্ত",
  "ডেলিভারি সমস্যা",
  "রিটার্ন / বাইব্যাক",
  "পাইকারি অর্ডার",
  "অডিও বুক সহায়তা",
];

const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function ContactForm() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    subject: subjects[0],
    orderId: "",
    message: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  const update = (patch: Partial<typeof form>) => setForm((previous) => ({ ...previous, ...patch }));

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const next: Record<string, string> = {};
    if (form.name.trim().length < 3) next.name = "আপনার নাম লিখুন";
    if (!/^\S+@\S+\.\S+$/.test(form.email)) next.email = "সঠিক ইমেইল দিন";
    if (form.phone && form.phone.replace(/\D/g, "").length < 11) {
      next.phone = "১১ ডিজিটের মোবাইল নম্বর দিন";
    }
    if (form.message.trim().length < 15) next.message = "অন্তত ১৫ অক্ষরের বার্তা লিখুন";
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-6 text-center sm:p-9">
        <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-forest-100 text-forest-700">
          <CheckCircle2 size={26} />
        </span>
        <p className="mt-4 text-[9px] font-semibold uppercase tracking-[0.2em] text-clay-500">
          Message Sent
        </p>
        <h2 className="mt-1 font-display text-2xl font-bold text-forest-950">ধন্যবাদ, আপনার বার্তা পৌঁছেছে</h2>
        <p className="mx-auto mt-2 max-w-md text-xs leading-relaxed text-muted">
          আমাদের টিম সাধারণত ১ কর্মদিবসের মধ্যে ইমেইল বা ফোনে সাড়া দেয়। জরুরি
          প্রয়োজনে হোয়াটসঅ্যাপে সরাসরি মেসেজ করুন।
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-2">
          <Button href="/books" size="sm">বই দেখুন</Button>
          <Button type="button" variant="outline" size="sm" onClick={() => setSubmitted(false)}>
            আরেকটি বার্তা পাঠান
          </Button>
        </div>
        <p className="mt-4 text-[9px] text-muted">ডেমো ফর্ম · কোনো তথ্য সার্ভারে পাঠানো হয়নি</p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} noValidate className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
      <div className="flex items-center gap-2.5">
        <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-900 text-gold-300">
          <MessageSquareText size={17} />
        </span>
        <div>
          <h2 className="font-display text-lg font-bold text-forest-950">আমাদের লিখুন</h2>
          <p className="text-[9px] text-muted">যেকোনো প্রশ্ন, পরামর্শ বা অভিযোগ জানান</p>
        </div>
      </div>

      <div className="mt-4 grid gap-3 sm:grid-cols-2">
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">নাম <span className="text-clay-500">*</span></span>
          <input value={form.name} onChange={(event) => update({ name: event.target.value })} placeholder="আপনার নাম" autoComplete="name" className={cn(inputClass, errors.name && "border-clay-500/70")} />
          {errors.name && <span className="mt-1 block text-[10px] text-clay-600">{errors.name}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">ইমেইল <span className="text-clay-500">*</span></span>
          <input type="email" value={form.email} onChange={(event) => update({ email: event.target.value })} placeholder="you@example.com" autoComplete="email" className={cn(inputClass, errors.email && "border-clay-500/70")} />
          {errors.email && <span className="mt-1 block text-[10px] text-clay-600">{errors.email}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">মোবাইল <span className="font-normal text-muted">(ঐচ্ছিক)</span></span>
          <input value={form.phone} onChange={(event) => update({ phone: event.target.value })} placeholder="+880 1XXXXXXXXX" autoComplete="tel" inputMode="tel" className={cn(inputClass, errors.phone && "border-clay-500/70")} />
          {errors.phone && <span className="mt-1 block text-[10px] text-clay-600">{errors.phone}</span>}
        </label>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">বিষয়</span>
          <select value={form.subject} onChange={(event) => update({ subject: event.target.value })} className={inputClass}>
            {subjects.map((subject) => <option key={subject}>{subject}</option>)}
          </select>
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
            <ShoppingBag size={12} /> অর্ডার নম্বর <span className="font-normal text-muted">(যদি থাকে)</span>
          </span>
          <input value={form.orderId} onChange={(event) => update({ orderId: event.target.value })} placeholder="যেমন: TNB-XXXXXX" className={inputClass} />
        </label>
        <label className="block sm:col-span-2">
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">বার্তা <span className="text-clay-500">*</span></span>
          <textarea
            value={form.message}
            onChange={(event) => update({ message: event.target.value })}
            rows={5}
            placeholder="আপনার প্রশ্ন বা সমস্যাটি বিস্তারিত লিখুন..."
            className={cn(
              "w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-3 text-[13px] leading-relaxed text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25",
              errors.message && "border-clay-500/70",
            )}
          />
          {errors.message && <span className="mt-1 block text-[10px] text-clay-600">{errors.message}</span>}
        </label>
      </div>

      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 border-t border-forest-900/8 pt-4">
        <p className="flex items-center gap-1.5 text-[9px] text-muted">
          <Sparkles size={11} /> ১ কর্মদিবসের মধ্যে সাড়া দেওয়ার চেষ্টা করি
        </p>
        <Button type="submit" size="sm">
          <Send size={13} /> বার্তা পাঠান
        </Button>
      </div>
    </form>
  );
}
