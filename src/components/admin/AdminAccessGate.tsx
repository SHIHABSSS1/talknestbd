"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LockKeyhole, RefreshCw } from "lucide-react";

import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import { allPageHrefs } from "@/lib/admin-access";

/**
 * Client-side UX gate. The server layout already requires an admin session;
 * this component only hides pages the signed-in admin's role cannot open.
 */
export function AdminAccessGate({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { hydrated, error, refresh, isSuperAdmin, canAccessPage, currentRole, currentUser } =
    useAdminAccess();

  const isKnownPage =
    allPageHrefs().includes(pathname) || pathname.startsWith("/admin/sections/");
  const isProfile = pathname === "/admin/profile";

  if (!hydrated) {
    return <p className="p-4 text-[12px] text-muted">Loading your access…</p>;
  }

  if (error) {
    return (
      <section className="mx-auto max-w-xl">
        <div className="rounded-[10px] border border-line bg-white p-6 sm:p-8">
          <h1 className="font-display text-xl font-bold text-ink">
            Could not load admin access
          </h1>
          <p className="mt-2 text-[12px] text-muted">{error}</p>
          <button
            type="button"
            onClick={() => void refresh()}
            className="mt-5 inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
          >
            <RefreshCw size={13} /> Try again
          </button>
        </div>
      </section>
    );
  }

  if (!currentRole && !isProfile) {
    return (
      <section className="mx-auto max-w-xl">
        <div className="rounded-[10px] border border-line bg-white p-6 sm:p-8">
          <LockKeyhole size={20} className="text-brand-700" />
          <h1 className="mt-4 font-display text-xl font-bold text-ink">
            No admin role assigned
          </h1>
          <p className="mt-2 text-[12px] leading-relaxed text-muted">
            Your account can open the panel, but no role has been granted to it yet.
            Ask a super admin to assign one on the Users &amp; roles page.
          </p>
          <Link
            href="/admin/profile"
            className="mt-5 inline-flex h-9 items-center rounded-[4px] border border-line px-4 text-[11px] font-medium text-ink hover:border-brand-300"
          >
            Admin profile
          </Link>
        </div>
      </section>
    );
  }

  const allowed =
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
          Your role (<span className="font-semibold text-ink">{currentRole?.name ?? "Admin"}</span>)
          has not been granted access to this page. A super admin can grant it on
          the Users &amp; roles page.
        </p>
        <p className="mt-1 text-[10px] text-muted">
          Signed in as: {currentUser?.name ?? "Admin"}
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
        </div>
      </div>
    </section>
  );
}
