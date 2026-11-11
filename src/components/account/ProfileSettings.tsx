"use client";

import { useEffect, useState } from "react";
import { Bell, Lock, Mail, MapPin, Phone, Save, UserRound } from "lucide-react";
import {
  readProfile,
  saveProfile,
  type Profile,
} from "@/lib/orders";
import { useStore } from "@/lib/store";
import { cn, initials } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

const PREF_KEY = "talknestbd-preferences-v1";

interface Preferences {
  newsletter: boolean;
  orderUpdates: boolean;
  audioReleases: boolean;
  community: boolean;
}

const defaultPreferences: Preferences = {
  newsletter: true,
  orderUpdates: true,
  audioReleases: true,
  community: false,
};

export function ProfileSettings() {
  const { notify } = useStore();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [preferences, setPreferences] = useState<Preferences>(defaultPreferences);
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    setProfile(readProfile());
    try {
      const raw = window.localStorage.getItem(PREF_KEY);
      if (raw) {
        setPreferences({ ...defaultPreferences, ...(JSON.parse(raw) as Partial<Preferences>) });
      }
    } catch {
      // ignore malformed preference data
    }
  }, []);

  if (!profile) {
    return <div className="h-80 animate-pulse rounded-3xl bg-cream-100" />;
  }

  const save = () => {
    const next: Record<string, string> = {};
    if (!profile.name.trim()) next.name = "নাম লিখুন";
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) next.email = "সঠিক ইমেইল দিন";
    if (profile.phone.replace(/\D/g, "").length < 11) {
      next.phone = "১১ ডিজিটের মোবাইল নম্বর দিন";
    }
    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }
    setErrors({});
    saveProfile(profile);
    try {
      window.localStorage.setItem(PREF_KEY, JSON.stringify(preferences));
    } catch {
      // ignore
    }
    notify("প্রোফাইল ও সেটিংস সংরক্ষণ হয়েছে");
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold text-forest-950">প্রোফাইল ও সেটিংস</h1>
        <p className="mt-0.5 text-[10px] text-muted">
          আপনার তথ্য, যোগাযোগের নম্বর ও নোটিফিকেশন পছন্দ আপডেট করুন।
        </p>
      </div>

      <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4 border-b border-forest-900/8 pb-4">
          <span className="grid h-14 w-14 place-items-center rounded-full bg-forest-900 font-display text-lg font-bold text-gold-300">
            {initials(profile.name)}
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold text-forest-950">{profile.name}</p>
            <p className="text-[10px] text-muted">{profile.email}</p>
            <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-forest-100 px-2 py-0.5 text-[8px] font-semibold text-forest-700">
              ডেমো অ্যাকাউন্ট
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <UserRound size={12} /> পুরো নাম
            </span>
            <input
              value={profile.name}
              onChange={(event) => setProfile({ ...profile, name: event.target.value })}
              className={cn(inputClass, errors.name && "border-clay-500/70")}
            />
            {errors.name && <span className="mt-1 block text-[10px] text-clay-600">{errors.name}</span>}
          </label>

          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <Mail size={12} /> ইমেইল
            </span>
            <input
              type="email"
              value={profile.email}
              onChange={(event) => setProfile({ ...profile, email: event.target.value })}
              className={cn(inputClass, errors.email && "border-clay-500/70")}
            />
            {errors.email && <span className="mt-1 block text-[10px] text-clay-600">{errors.email}</span>}
          </label>

          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <Phone size={12} /> মোবাইল নম্বর
            </span>
            <input
              value={profile.phone}
              onChange={(event) => setProfile({ ...profile, phone: event.target.value })}
              className={cn(inputClass, errors.phone && "border-clay-500/70")}
            />
            {errors.phone && <span className="mt-1 block text-[10px] text-clay-600">{errors.phone}</span>}
          </label>

          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <MapPin size={12} /> শহর
            </span>
            <input
              value={profile.city}
              onChange={(event) => setProfile({ ...profile, city: event.target.value })}
              placeholder="যেমন: ঢাকা"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
          <Bell size={16} className="text-forest-600" />
          নোটিফিকেশন পছন্দ
        </h2>
        <div className="mt-3 space-y-1">
          {[
            { key: "newsletter" as const, title: "সাপ্তাহিক নিউজলেটার", detail: "নতুন বই, লেখকের গল্প ও অফারের খবর" },
            { key: "orderUpdates" as const, title: "অর্ডার আপডেট", detail: "অর্ডার কনফার্মেশন ও ডেলিভারি স্ট্যাটাস" },
            { key: "audioReleases" as const, title: "নতুন অডিও বুক", detail: "নতুন অডিও এপিসোড ও ফ্রি প্রিভিউ" },
            { key: "community" as const, title: "কমিউনিটি আয়োজন", detail: "কুইজ, আড্ডা ও পাঠক ইভেন্টের আমন্ত্রণ" },
          ].map((item) => (
            <label
              key={item.key}
              className="flex cursor-pointer items-center justify-between gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-cream-100/70"
            >
              <span>
                <span className="block text-[11px] font-medium text-forest-900">{item.title}</span>
                <span className="block text-[9px] text-muted">{item.detail}</span>
              </span>
              <input
                type="checkbox"
                checked={preferences[item.key]}
                onChange={(event) =>
                  setPreferences((previous) => ({ ...previous, [item.key]: event.target.checked }))
                }
                className="h-4 w-4 accent-forest-900"
              />
            </label>
          ))}
        </div>
      </section>

      <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
          <Lock size={16} className="text-forest-600" />
          নিরাপত্তা
        </h2>
        <p className="mt-1 text-[10px] leading-relaxed text-muted">
          এটি একটি ফ্রন্টএন্ড ডেমো অ্যাকাউন্ট — এখানে কোনো আসল পাসওয়ার্ড বা
          লগইন তথ্য সংরক্ষিত হয় না। ভবিষ্যতে পেমেন্ট ও অর্ডার সিস্টেমের সঙ্গে
          নিরাপদ অথেন্টিকেশন যুক্ত হবে।
        </p>
        <Button href="/login" variant="outline" size="sm" className="mt-3">
          লগইন পেজ দেখুন
        </Button>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3">
        <p className="text-[9px] text-muted">
          পরিবর্তনগুলো শুধু এই ব্রাউজারে সংরক্ষিত হবে।
        </p>
        <Button type="button" size="sm" onClick={save}>
          <Save size={13} />
          সেটিংস সংরক্ষণ করুন
        </Button>
      </div>
    </div>
  );
}
