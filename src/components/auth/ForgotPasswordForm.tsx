"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, KeyRound, Lock, Mail } from "lucide-react";

import { AuthShell } from "@/components/auth/AuthShell";
import { Button } from "@/components/ui/Button";
import { authClient } from "@/lib/auth-client";
import { useResendCooldown } from "@/components/auth/useResendCooldown";

export function ForgotPasswordForm() {
  const [step, setStep] = useState<"request" | "reset" | "done">("request");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const { remaining: resendIn, active: resendCooling, start: startCooldown } =
    useResendCooldown(60);

  const inputClass =
    "h-12 w-full rounded-xl border border-forest-900/12 bg-cream-50 pl-11 pr-4 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

  async function requestOtp(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Enter a valid email address.");
      return;
    }

    setSubmitting(true);
    const { error: requestError } = await authClient.emailOtp.requestPasswordReset({
      email: email.trim().toLowerCase(),
    });

    if (requestError) {
      setError(
        requestError.status === 429
          ? "Too many attempts. Please wait a few minutes before requesting another code."
          : "We couldn't send a code right now. Please try again in a moment.",
      );
      setSubmitting(false);
      return;
    }

    // The server returns the same result whether or not the account exists,
    // so this copy must not confirm either case.
    startCooldown();
    setStep("reset");
    setSubmitting(false);
  }

  async function resetPassword(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    if (!/^\d{6}$/.test(otp)) {
      setError("Enter the 6-digit code.");
      return;
    }
    if (password.length < 8) {
      setError("The new password must be at least 8 characters.");
      return;
    }

    setSubmitting(true);
    const { error: resetError } = await authClient.emailOtp.resetPassword({
      email: email.trim().toLowerCase(),
      otp,
      password,
    });

    if (resetError) {
      setError("The code is incorrect or has expired. Please try again.");
      setSubmitting(false);
      return;
    }

    setStep("done");
    setSubmitting(false);
  }

  async function resendOtp() {
    setError("");
    const { error: resendError } = await authClient.emailOtp.sendVerificationOtp({
      email: email.trim().toLowerCase(),
      type: "forget-password",
    });
    if (resendError) {
      setError(
        resendError.status === 429
          ? "Too many attempts. Please wait a few minutes before requesting another code."
          : "Could not send the code. Please try again in a moment.",
      );
      return;
    }
    setError("");
    startCooldown();
  }

  return (
    <AuthShell
      eyebrow="Reset Password"
      title={
        step === "request"
          ? "Forgot your password?"
          : step === "reset"
            ? "Set a new password"
            : "Password updated"
      }
      subtitle={
        step === "request"
          ? "Enter your email and we'll send a code if an account exists."
          : step === "reset"
            ? `If ${email.trim()} is registered, a code is on its way.`
            : "You can now log in with your new password."
      }
      icon={step === "request" ? <KeyRound size={20} /> : <Lock size={20} />}
      footer={
        <Link
          href="/login"
          className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-clay-600"
        >
          <ArrowLeft size={13} /> Back to login
        </Link>
      }
    >
      {step === "request" ? (
        <form onSubmit={requestOtp} className="space-y-4" noValidate>
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

          {error ? <FormError message={error} /> : null}

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Sending code…" : "Send reset code"}
            <ArrowRight size={15} />
          </Button>
        </form>
      ) : step === "reset" ? (
        <form onSubmit={resetPassword} className="space-y-4" noValidate>
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

          <label className="block">
            <span className="mb-1 block text-[11px] font-semibold text-forest-900">New password</span>
            <span className="relative block">
              <Lock
                size={16}
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-forest-700/40"
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="At least 8 characters"
                autoComplete="new-password"
                className={inputClass}
              />
            </span>
          </label>

          {error ? <FormError message={error} /> : null}

          <p className="rounded-xl bg-cream-100/70 px-3 py-2 text-[10px] leading-relaxed text-muted">
            No code after a few minutes? The address may not be registered.{" "}
            <Link href="/register" className="font-semibold text-clay-600 hover:text-clay-500">
              Create an account
            </Link>
            .
          </p>

          <Button type="submit" size="lg" className="w-full" disabled={submitting}>
            {submitting ? "Saving…" : "Set password"}
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
      ) : (
        <div className="rounded-xl border border-forest-900/10 bg-forest-50 px-4 py-4">
          <p className="text-[12px] leading-relaxed text-forest-900">
            Your password has been changed successfully. You can now{" "}
            <Link href="/login" className="font-semibold text-clay-600 hover:text-clay-500">
              log in
            </Link>{" "}
            to access your account.
          </p>
        </div>
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
