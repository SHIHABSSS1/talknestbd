"use client";

import { createAuthClient } from "better-auth/react";
import { emailOTPClient, inferAdditionalFields } from "better-auth/client/plugins";

import type { auth } from "@/lib/auth";

export const authClient = createAuthClient({
  // Omitted baseURL = same origin, which keeps local dev and the VPS identical.
  plugins: [
    // Give the client the server's `user.role` field without importing server code.
    inferAdditionalFields<typeof auth>(),
    emailOTPClient(),
  ],
});

export const { signIn, signUp, signOut, useSession } = authClient;
