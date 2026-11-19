import "server-only";

import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { emailOTP } from "better-auth/plugins";

import { db } from "@/lib/db";
import {
  accounts,
  rateLimits,
  sessions,
  users,
  verifications,
} from "@/lib/db/schema";
import { sendOtpEmail } from "@/lib/email";

const secret = process.env.BETTER_AUTH_SECRET;
if (!secret) {
  throw new Error(
    "BETTER_AUTH_SECRET is not set. Copy .env.example to .env.local and paste a 32+ byte random secret.",
  );
}

const baseURL =
  process.env.BETTER_AUTH_URL ??
  process.env.NEXT_PUBLIC_APP_URL ??
  "http://localhost:3000";

const googleProvider =
  process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
    ? {
        google: {
          clientId: process.env.GOOGLE_CLIENT_ID,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET,
        },
      }
    : {};

// Behind Nginx, set TRUSTED_PROXIES to the proxy's IP/CIDR so the real client
// IP is used as the rate-limit key. Direct connections ignore forwarded headers
// entirely, otherwise a client could spoof X-Forwarded-For and evade limits.
const trustedProxies = process.env.TRUSTED_PROXIES?.split(",")
  .map((value) => value.trim())
  .filter(Boolean);

export const auth = betterAuth({
  secret,
  baseURL,
  advanced: {
    ipAddress: trustedProxies?.length
      ? { trustedProxies }
      : { ipAddressHeaders: [] },
  },
  database: drizzleAdapter(db, {
    provider: "pg",
    schema: {
      user: users,
      session: sessions,
      account: accounts,
      verification: verifications,
      rateLimit: rateLimits,
    },
  }),

  rateLimit: {
    enabled: true,
    // Counters live in Postgres so they survive restarts and work with
    // multiple server instances.
    storage: "database",
    window: 60,
    max: 100,
    customRules: {
      "/email-otp/send-verification-otp": { window: 300, max: 3 },
      "/email-otp/request-password-reset": { window: 300, max: 3 },
      "/email-otp/verify-email": { window: 60, max: 10 },
      "/email-otp/reset-password": { window: 60, max: 5 },
      "/email-otp/check-verification-otp": { window: 60, max: 10 },
      "/sign-in/email": { window: 60, max: 5 },
      "/sign-up/email": { window: 300, max: 3 },
    },
  },

  emailAndPassword: {
    enabled: true,
    minPasswordLength: 8,
    maxPasswordLength: 128,
    // Registration always goes through the email-verification OTP step.
    requireEmailVerification: true,
  },

  emailVerification: {
    // emailOTP(overrideDefaultEmailVerification) turns this into an OTP email.
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: 10 * 60,
  },

  socialProviders: googleProvider,

  user: {
    additionalFields: {
      role: {
        type: ["customer", "admin"],
        required: false,
        defaultValue: "customer",
        returned: true,
        // Never let a client sign up as an admin.
        input: false,
      },
      phone: { type: "string", required: false },
      city: { type: "string", required: false },
    },
  },

  plugins: [
    emailOTP({
      overrideDefaultEmailVerification: true,
      otpLength: 6,
      expiresIn: 10 * 60,
      sendVerificationOTP: async ({ email, otp, type }) => {
        await sendOtpEmail({ email, otp, type });
      },
    }),
  ],
});
