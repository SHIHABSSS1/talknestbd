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
    if (!profile.name.trim()) next.name = "Enter your name";
    if (!/^\S+@\S+\.\S+$/.test(profile.email)) next.email = "Enter a valid email address";
    if (profile.phone.replace(/\D/g, "").length < 11) {
      next.phone = "Enter an 11-digit mobile number";
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
    notify("Profile and settings saved");
  };

  const inputClass =
    "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  return (
    <div className="space-y-4">
      <div>
        <h1 className="font-display text-xl font-bold text-forest-950">Profile and settings</h1>
        <p className="mt-0.5 text-[10px] text-muted">
          Update your details, contact number and notification preferences.
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
              Demo account
            </span>
          </div>
        </div>

        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="mb-1 flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
              <UserRound size={12} /> Full name
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
              <Mail size={12} /> Email
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
              <Phone size={12} /> Mobile number
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
              <MapPin size={12} /> City
            </span>
            <input
              value={profile.city}
              onChange={(event) => setProfile({ ...profile, city: event.target.value })}
              placeholder="For example: Dhaka"
              className={inputClass}
            />
          </label>
        </div>
      </section>

      <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
        <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
          <Bell size={16} className="text-forest-600" />
          Notification preferences
        </h2>
        <div className="mt-3 space-y-1">
          {[
            { key: "newsletter" as const, title: "Weekly newsletter", detail: "New books, author stories and offers" },
            { key: "orderUpdates" as const, title: "Order updates", detail: "Order confirmation and delivery status" },
            { key: "audioReleases" as const, title: "New audiobooks", detail: "New audio releases and free previews" },
            { key: "community" as const, title: "Community events", detail: "Invitations to quizzes, conversations and reader events" },
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
          Security
        </h2>
        <p className="mt-1 text-[10px] leading-relaxed text-muted">
          This is a front-end demo account. No real password or login details
          are stored. Secure authentication will be added with the live payment
          and order system in the future.
        </p>
        <Button href="/login" variant="outline" size="sm" className="mt-3">
          View login page
        </Button>
      </section>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3">
        <p className="text-[9px] text-muted">
          Changes are saved only in this browser.
        </p>
        <Button type="button" size="sm" onClick={save}>
          <Save size={13} />
          Save settings
        </Button>
      </div>
    </div>
  );
}
