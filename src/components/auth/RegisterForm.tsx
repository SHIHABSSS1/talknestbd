"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck, UserRound } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleButton";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { cn } from "@/lib/utils";
import { useResendCooldown } from "@/components/auth/useResendCooldown";

export function RegisterForm() {
  const router = useRouter();
  const [step, setStep] = useState<"details" | "verify">("details");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { remaining: resendIn, active: resendCooling, start: startCooldown } =
    useResendCooldown(60);

  const inputClass =
    "h-12 w-full rounded-xl border border-forest-900/12 bg-cream-50 pl-11 pr-4 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  async function submitDetails(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (name.trim().length < 3) {
      setError("Enter your full name.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("The two passwords do not match.");
      return;
    }

    setSubmitting(true);
    const { error: signUpError } = await authClient.signUp.email({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password,
      callbackURL: "/account",
    });

    if (signUpError) {
      setError(signUpError.message ?? "Could not create the account.");
      setSubmitting(false);
      return;
    }

    setNotice(`We sent a 6-digit code to ${email.trim().toLowerCase()}.`);
    startCooldown();
    setStep("verify");
    setSubmitting(false);
  }

  async function submitOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.");
      return;
    }

    setSubmitting(true);
    const { error: verifyError } = await authClient.emailOtp.verifyEmail({
      email: email.trim().toLowerCase(),
      otp,
    });

    if (verifyError) {
      setError("The code is incorrect or has expired. Please try again.");
      setSubmitting(false);
      return;
    }

    router.push("/account");
    router.refresh();
  }

  async function resendOtp() {
    setError("");
    const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim().toLowerCase(),
      type: "email-verification",
    });
    if (resendError) {
      setError(
        resendError.status === 429
          ? "Too many attempts. Please wait a few minutes before requesting another code."
          : "Could not send the code. Please try again in a moment.",
      );
      return;
    }
    setNotice("A new code has been sent.");
    startCooldown();
  }

  return (
    <AuthShell
      eyebrow="Create Account"
      title={step === "details" ? "Create an account" : "Verify your email"}
      subtitle={
        step === "details"
          ? "Join the reading community by creating a free account."
          : "Enter the code we sent to your email address."
      }
      icon={step === "details" ? <UserRound size={20} /> : <ShieldCheck size={20} />}
      footer={
        <p className="text-center text-[10px] text-muted">
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-clay-600 hover:text-clay-500">
            Log in
          </Link>
        </p>
      }
    >
      {step === "details" ? (
        <>
          <form onSubmit={submitDetails} className="space-y-3" noValidate>
            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">Full name</span>
              <span className="relative block">
                <UserRound
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40"
                />
                <input
                  value={name}
                  onChange={(event) => setName(event.target.value)}
                  placeholder="Your name"
                  autoComplete="name"
                  className={inputClass}
                />
              </span>
            </label>

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
                  placeholder="At least 8 characters"
                  autoComplete="new-password"
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

            <label className="block">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                Confirm password
              </span>
              <span className="relative block">
                <Lock
                  size={16}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40"
                />
                <input
                  type={showPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  placeholder="Repeat your password"
                  autoComplete="new-password"
                  className={inputClass}
                />
              </span>
            </label>

            {error ? <FormError message={error} /> : null}

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? "Creating account…" : "Create account"}
              <ArrowRight size={15} />
            </Button>
          </form>

          <div className="my-4 flex items-center gap-3 text-[9px] text-muted">
            <span className="h-px flex-1 bg-forest-900/10" />
            Or
            <span className="h-px flex-1 bg-forest-900/10" />
          </div>
          <GoogleButton />
        </>
      ) : (
        <form onSubmit={submitOtp} className="space-y-4" noValidate>
          <div className="rounded-xl border border-forest-900/10 bg-cream-100/70 px-4 py-3">
            <p className="text-[11px] leading-relaxed text-forest-900">{notice}</p>
            <p className="mt-1 text-[10px] text-muted">The code is valid for 10 minutes.</p>
          </div>

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">6-digit code</span>
            <input
              value={otp}
              onChange={(event) => setOtp(event.target.value.replace(/\D/g, "").slice(0, 6))}
              inputMode="numeric"
              autoComplete="one-time-code"
              placeholder="000000"
              className="h-14 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-4 text-center text-2xl font-semibold tracking-[0.4em] text-forest-950 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
            />
          </label>

          {error ? <FormError message={error} /> : null}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Verifying…" : "Verify email"}
            <ArrowRight size={15} />
          </Button>

          <button
            type="button"
            onClick={resendOtp}
            disabled={resendCooling}
            className="w-full text-center text-[10px] font-medium text-clay-600 hover:text-clay-500 disabled:cursor-not-allowed disabled:text-muted"
          >
            {resendCooling
              ? `Resend available in ${resendIn}s`
              : "Didn't receive the code? Send it again"}
          </button>
        </form>
      )}
    </AuthShell>
  );
}

function FormError({ message }: { message: string }) {
  return (
    <p className="rounded-xl border border-clay-500/20 bg-clay-500/5 px-3 py-2 text-[10px] text-clay-600">
      {message}
    </p>
  );
}
