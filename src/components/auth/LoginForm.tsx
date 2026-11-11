"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Heart,
  Lock,
  Mail,
  ShieldCheck,
  UserRound,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { defaultProfile, readProfile, saveProfile } from "@/lib/orders";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";

export function LoginForm() {
  const router = useRouter();
  const { notify } = useStore();
  const [mode, setMode] = useState<"login" | "register">("login");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (mode === "register" && name.trim().length < 3) {
      setError("আপনার পুরো নাম লিখুন");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("সঠিক ইমেইল ঠিকানা দিন");
      return;
    }
    if (password.length < 4) {
      setError("কমপক্ষে ৪ অক্ষরের পাসওয়ার্ড দিন (ডেমো)");
      return;
    }
    setError("");
    if (mode === "register") {
      saveProfile({
        ...defaultProfile,
        name: name.trim(),
        email: email.trim(),
        phone: readProfile().phone,
      });
      notify("ডেমো অ্যাকাউন্ট তৈরি হয়েছে");
    } else {
      notify("ডেমো লগইন সফল হয়েছে");
    }
    router.push("/account");
  };

  const inputClass =
    "h-12 w-full rounded-xl border border-forest-900/12 bg-cream-50 pl-11 pr-4 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-forest-900/8 bg-cream-50 shadow-[0_30px_70px_-55px_rgba(10,33,24,0.5)] lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-forest-950 p-8 text-cream-50 lg:block">
        <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.1]" />
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold-400/15"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-gold-400/10"
        />
        <div className="relative flex h-full flex-col">
          <span className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/25 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-300">
            TalkNest Reader Club
          </span>
          <h2 className="mt-6 max-w-sm font-display text-3xl font-bold leading-snug">
            আপনার পড়ার জগৎ,
            <br />
            <span className="text-gold-300">একটি অ্যাকাউন্টে।</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-100/55">
            অর্ডার ট্র্যাক, সংরক্ষিত ঠিকানা, উইশলিস্ট আর অডিও লাইব্রেরি —
            সবকিছু এক জায়গায় সাজিয়ে রাখুন।
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Heart, title: "উইশলিস্ট সিঙ্ক", text: "পছন্দের বই সংরক্ষণ করুন" },
              { icon: ShieldCheck, title: "নিরাপদ অর্ডার", text: "ঠিকানা ও অর্ডার ইতিহাস" },
              { icon: UserRound, title: "নিজের পাঠ-প্রোফাইল", text: "রিভিউ ও কমিউনিটি অংশগ্রহণ" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300">
                  <item.icon size={15} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-cream-50">{item.title}</p>
                  <p className="text-[9px] text-cream-100/40">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-display text-sm font-semibold text-gold-300">
              “প্রতিটি বই একটি নতুন জীবনের দরজা।”
            </p>
            <p className="mt-1 text-[9px] text-cream-100/40">— TalkNest পাঠক</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
              {mode === "login" ? "Welcome Back" : "Create Account"}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
              {mode === "login" ? "আবার স্বাগতম" : "নতুন অ্যাকাউন্ট"}
            </h1>
            <p className="mt-1 text-[11px] text-muted">
              {mode === "login"
                ? "অর্ডার ও উইশলিস্ট দেখতে লগইন করুন।"
                : "একটি ডেমো অ্যাকাউন্ট তৈরি করে শুরু করুন।"}
            </p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
            <UserRound size={20} />
          </span>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-3" noValidate>
          {mode === "register" && (
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">পুরো নাম</span>
              <span className="relative block">
                <UserRound size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40" />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="আপনার নাম"
                  autoComplete="name"
                  className={inputClass}
                />
              </span>
            </label>
          )}

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">ইমেইল</span>
            <span className="relative block">
              <Mail size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40" />
              <input
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className={inputClass}
              />
            </span>
          </label>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">পাসওয়ার্ড</span>
            <span className="relative block">
              <Lock size={16} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="••••••••"
                autoComplete={mode === "login" ? "current-password" : "new-password"}
                className={cn(inputClass, "pr-11")}
              />
              <button
                type="button"
                onClick={() => setShowPassword((value) => !value)}
                aria-label={showPassword ? "পাসওয়ার্ড লুকান" : "পাসওয়ার্ড দেখান"}
                className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-forest-700/40 hover:text-forest-800"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </span>
          </label>

          {error && (
            <p className="rounded-xl border border-clay-500/20 bg-clay-500/5 px-3 py-2 text-[10px] text-clay-600">
              {error}
            </p>
          )}

          <div className="flex items-center justify-between gap-3 text-[10px]">
            <label className="flex items-center gap-1.5 text-muted">
              <input type="checkbox" defaultChecked className="h-3.5 w-3.5 accent-forest-900" />
              মনে রাখুন
            </label>
            <span className="font-medium text-clay-600">পাসওয়ার্ড ভুলে গেছেন?</span>
          </div>

          <Button type="submit" size="lg" className="w-full">
            {mode === "login" ? "লগইন করুন" : "অ্যাকাউন্ট তৈরি করুন"}
            <ArrowRight size={15} />
          </Button>
        </form>

        <div className="my-4 flex items-center gap-3 text-[9px] text-muted">
          <span className="h-px flex-1 bg-forest-900/10" />
          অথবা
          <span className="h-px flex-1 bg-forest-900/10" />
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => {
            notify("ডেমো গেস্ট লগইন — সরাসরি অ্যাকাউন্টে যাচ্ছেন");
            router.push("/account");
          }}
        >
          গেস্ট হিসেবে চালিয়ে যান
        </Button>

        <p className="mt-4 text-center text-[10px] text-muted">
          {mode === "login" ? "নতুন পাঠক?" : "আগে থেকেই অ্যাকাউন্ট আছে?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(mode === "login" ? "register" : "login");
              setError("");
            }}
            className="font-semibold text-clay-600 hover:text-clay-500"
          >
            {mode === "login" ? "অ্যাকাউন্ট তৈরি করুন" : "লগইন করুন"}
          </button>
        </p>

        <p className="mt-4 rounded-xl bg-cream-100/70 px-3 py-2 text-center text-[9px] leading-relaxed text-muted">
          ডেমো লগইন — কোনো আসল পাসওয়ার্ড যাচাই বা সার্ভার সংযোগ নেই।{" "}
          <Link href="/privacy" className="font-semibold text-forest-800">
            প্রাইভেসি
          </Link>
        </p>
      </div>
    </div>
  );
}
