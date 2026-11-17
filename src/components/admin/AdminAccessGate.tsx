"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole } from "lucide-react";
import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import { allPageHrefs, SUPER_ADMIN_USER_ID } from "@/lib/admin-access";

/**
 * Front-end demo guard: hides admin pages that the signed-in role has not been
 * granted. This is a UX preview only — there is no server to enforce it.
 */
export function AdminAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    hydrated,
    isSuperAdmin,
    canAccessPage,
    currentRole,
    currentUser,
    switchUser,
  } = useAdminAccess();

  const isKnownPage =
    allPageHrefs().includes(pathname) || pathname.startsWith("/admin/sections/");
  const isProfile = pathname === "/admin/profile";

  const allowed =
    !hydrated ||
    isProfile ||
    (pathname === "/admin/users"
      ? isSuperAdmin
      : !isKnownPage || canAccessPage(pathname));

  if (allowed) return <>{children}</>;

  return (
    <section className="mx-auto max-w-xl">
      <div className="rounded-[10px] border border-line bg-white p-6 sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-[9px] bg-brand-50 text-brand-700">
          <LockKeyhole size={20} />
        </span>
        <h1 className="mt-4 font-display text-xl font-bold text-ink">
          You don&apos;t have access to this page
        </h1>
        <p className="mt-2 text-[12px] leading-relaxed text-muted">
          Your current role (
          <span className="font-semibold text-ink">{currentRole?.name ?? "Admin"}</span>)
          has not been granted access to this page. A super admin can grant it on
          the Users &amp; roles page.
        </p>
        <p className="mt-1 text-[10px] text-muted">
          Signed in as: {currentUser?.name ?? "Admin"} ·{" "}
          {currentUser?.batch ?? "—"}
        </p>
        <div className="mt-5 flex flex-wrap gap-2">
          <Link
            href="/admin"
            className="inline-flex h-9 items-center rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white transition-colors hover:bg-brand-700"
          >
            Back to dashboard
          </Link>
          <Link
            href="/admin/profile"
            className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300"
          >
            My profile
          </Link>
          {!isSuperAdmin && (
            <button
              type="button"
              onClick={() => switchUser(SUPER_ADMIN_USER_ID)}
              className="inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink transition-colors hover:border-brand-300"
            >
              Back to super admin
            </button>
          )}
        </div>
        <p className="mt-5 border-t border-line pt-3 text-[9px] leading-relaxed text-muted">
          Demo note: this control only applies in this browser; there is no server
          enforcing access.
        </p>
      </div>
    </section>
  );
}
