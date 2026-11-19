import "server-only";

import { headers } from "next/headers";
import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";

export async function getServerSession() {
  return auth.api.getSession({ headers: await headers() });
}

export function isAdminSession(
  session: Awaited<ReturnType<typeof getServerSession>>,
): boolean {
  return session?.user.role === "admin";
}

/** Storefront guard. Use in server components that need a signed-in reader. */
export async function requireUser(callbackUrl = "/account") {
  const session = await getServerSession();
  if (!session) {
    redirect(`/login?callbackUrl=${encodeURIComponent(callbackUrl)}`);
  }
  return session;
}

/** Admin guard. Use in the admin panel layout and every privileged mutation. */
export async function requireAdmin() {
  const session = await getServerSession();
  if (!session) {
    redirect("/admin/login");
  }
  if (session.user.role !== "admin") {
    redirect("/admin/login?error=forbidden");
  }
  return session;
}
