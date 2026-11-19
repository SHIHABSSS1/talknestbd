"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Eye,
  EyeOff,
  Layers3,
  LayoutDashboard,
  Lock,
  Mail,
  ShieldCheck,
  BookOpen,
} from "lucide-react";

import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";

const highlights = [
  { icon: Layers3, title: "Page sections", text: "Edit every homepage title and description" },
  { icon: LayoutDashboard, title: "Live overview", text: "Stats and shortcuts at a glance" },
  { icon: ShieldCheck, title: "Secure access", text: "Only accounts with the admin role can enter" },
];

export function AdminLoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "h-12 w-full rounded-[4px] border border-line bg-white pl-11 pr-4 text-[13px] text-ink placeholder:text-muted/50 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20";

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    const { error: signInError } = await authClient.signIn.email({
      email: email.trim().toLowerCase(),
      password,
      callbackURL: "/admin",
    });

    if (signInError) {
      setError("Incorrect email or password.");
      setSubmitting(false);
      return;
    }

    const { data: session } = await authClient.getSession();
    if (session?.user.role !== "admin") {
      await authClient.signOut();
      setError("This account does not have admin access.");
      setSubmitting(false);
      return;
    }

    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-[16px] border border-line bg-white shadow-[0_30px_70px_-55px_rgba(11,61,122,0.5)]">
      <div className="grid lg:grid-cols-[0.92fr_1.08fr]">
        <div className="relative hidden overflow-hidden bg-brand-950 p-9 text-white lg:block">
          <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.08]" />
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-24 h-72 w-72 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 h-72 w-72 rounded-full border border-white/10"
          />
          <div className="relative flex h-full flex-col">
            <Link
              href="/"
              className="inline-flex w-fit items-center gap-2 rounded-full border border-white/20 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-200"
            >
              <BookOpen size={11} /> TalkNest BD
            </Link>

            <h1 className="mt-8 max-w-sm font-display text-3xl font-bold leading-snug">
              Admin control
              <br />
              <span className="text-brand-300">center.</span>
            </h1>
            <p className="mt-3 max-w-sm text-[13px] leading-relaxed text-white/55">
              Manage homepage sections, books and community content from one
              simple dashboard.
            </p>

            <div className="mt-9 space-y-3.5">
              {highlights.map((item) => (
                <div key={item.title} className="flex items-center gap-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[8px] bg-white/10 text-brand-200">
                    <item.icon size={15} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold text-white">{item.title}</p>
                    <p className="text-[9px] text-white/45">{item.text}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-auto rounded-[10px] border border-white/10 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-200">
                Secure sign in
              </p>
              <p className="mt-1.5 text-[10px] leading-relaxed text-white/50">
                Sessions are stored in HTTP-only cookies and verified on the server.
              </p>
            </div>
          </div>
        </div>

        <div className="p-6 sm:p-10">
          <div className="flex items-start justify-between gap-3">
            <div>
              <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-brand-600">
                Admin access
              </p>
              <h2 className="mt-1 font-display text-2xl font-bold text-ink sm:text-[28px]">
                Welcome back
              </h2>
              <p className="mt-1 text-[11px] text-muted">Sign in to open your dashboard.</p>
            </div>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[10px] bg-brand-50 text-brand-700">
              <LayoutDashboard size={20} />
            </span>
          </div>

          <form onSubmit={submit} className="mt-7 space-y-4" noValidate>
            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-ink">Email</span>
              <span className="relative block">
                <Mail
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-700/40"
                />
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="admin@talknestbd.com"
                  autoComplete="username"
                  className={inputClass}
                />
              </span>
            </label>

            <label className="block">
              <span className="mb-1.5 block text-[11px] font-semibold text-ink">Password</span>
              <span className="relative block">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-brand-700/40"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  className={`${inputClass} pr-11`}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-brand-700/40 hover:text-brand-800"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {error ? (
              <p className="rounded-[8px] border border-clay-500/20 bg-clay-500/5 px-3 py-2 text-[10px] text-clay-600">
                {error}
              </p>
            ) : null}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Signing in…" : "Sign in to dashboard"}
              <ArrowRight size={15} />
            </Button>
          </form>

          <div className="mt-5 flex justify-center">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-100 bg-brand-50 px-3 py-1.5 text-[9px] font-medium text-brand-800">
              <ShieldCheck size={11} /> Admin-only access · secured by Better Auth
            </span>
          </div>

          <Link
            href="/"
            className="mt-6 inline-flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-brand-700"
          >
            <ArrowLeft size={13} /> Back to storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
