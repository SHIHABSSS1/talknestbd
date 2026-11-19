"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";

import { GoogleButton } from "@/components/auth/GoogleButton";
import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const inputClass =
    "h-12 w-full rounded-xl border border-forest-900/12 bg-cream-50 pl-11 pr-4 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

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
      rememberMe,
      callbackURL: "/account",
    });

    if (signInError) {
      setError(
        signInError.status === 403
          ? "Please verify your email address first."
          : "Incorrect email or password. Please try again.",
      );
      setSubmitting(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  return (
    <AuthShell
      eyebrow="Welcome Back"
      title="Welcome back"
      subtitle="Log in to view your orders and wishlist."
      icon={<LogIn size={20} />}
      footer={
        <p className="text-center text-[10px] text-muted">
          New reader?{" "}
          <Link
            href="/register"
            className="font-semibold text-clay-600 hover:text-clay-500"
          >
            Create an account
          </Link>
        </p>
      }
    >
      <form onSubmit={submit} className="space-y-3" noValidate>
        <label className="block">
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">Email</span>
          <span className="relative block">
            <Mail
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40"
            />
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
          <span className="mb-1 block text-[11px] font-semibold text-forest-900">Password</span>
          <span className="relative block">
            <Lock
              size={16}
              className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40"
            />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              className={cn(inputClass, "pr-11")}
            />
            <button
              type="button"
              onClick={() => setShowPassword((value) => !value)}
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-1 top-1/2 grid h-10 w-10 -translate-y-1/2 place-items-center rounded-full text-forest-700/40 hover:text-forest-800"
            >
              {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </span>
        </label>

        {error ? (
          <p className="rounded-xl border border-clay-500/20 bg-clay-500/5 px-3 py-2 text-[10px] text-clay-600">
            {error}
          </p>
        ) : null}

        <div className="flex items-center justify-between gap-3 text-[10px]">
          <label className="flex items-center gap-1.5 text-muted">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(event) => setRememberMe(event.target.checked)}
              className="h-3.5 w-3.5 accent-forest-900"
            />
            Remember me
          </label>
          <Link href="/forgot-password" className="font-medium text-clay-600 hover:text-clay-500">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" size="lg" className="w-full" disabled={submitting}>
          {submitting ? "Logging in…" : "Log in"}
          <ArrowRight size={15} />
        </Button>
      </form>

      <div className="my-4 flex items-center gap-3 text-[9px] text-muted">
        <span className="h-px flex-1 bg-forest-900/10" />
        Or
        <span className="h-px flex-1 bg-forest-900/10" />
      </div>

      <GoogleButton />
    </AuthShell>
  );
}
