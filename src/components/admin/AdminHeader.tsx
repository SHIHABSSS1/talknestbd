"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import {
  Bell,
  ChevronDown,
  ExternalLink,
  LogOut,
  Menu,
  Search,
  UserRound,
} from "lucide-react";
import { logoutAdmin } from "@/lib/admin-auth";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);

  const signOut = () => {
    logoutAdmin();
    setMenuOpen(false);
    router.push("/admin/login");
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-white/95 px-4 backdrop-blur sm:px-6">
      <button
        type="button"
        onClick={onMenuClick}
        aria-label="Open navigation"
        className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] border border-line text-ink transition-colors hover:bg-brand-50 hover:text-brand-700 lg:hidden"
      >
        <Menu size={18} />
      </button>

      <div className="min-w-0">
        <p className="truncate text-sm font-semibold text-ink">Admin panel</p>
        <p className="hidden text-[10px] text-muted sm:block">
          TalkNest BD · demo workspace
        </p>
      </div>

      <div className="ml-auto flex items-center gap-2">
        <label className="relative hidden md:block">
          <Search
            size={15}
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted"
          />
          <input
            type="search"
            placeholder="Search sections…"
            aria-label="Search sections"
            className="h-9 w-44 rounded-[4px] border border-line bg-canvas pl-9 pr-3 text-[11px] text-ink placeholder:text-muted/70 focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/15 lg:w-56"
          />
        </label>

        <Link
          href="/"
          className="hidden h-9 items-center gap-1.5 rounded-[4px] border border-line px-3 text-[11px] font-medium text-ink transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 sm:inline-flex"
        >
          View site <ExternalLink size={13} />
        </Link>

        <button
          type="button"
          aria-label="Notifications"
          className="relative grid h-9 w-9 place-items-center rounded-[4px] border border-line text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
          <Bell size={15} />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-sale" />
        </button>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Account menu"
            className="flex h-9 items-center gap-2 rounded-[4px] border border-line pl-1.5 pr-2 transition-colors hover:bg-brand-50"
          >
            <span className="grid h-6 w-6 place-items-center rounded-full bg-brand-600 text-white">
              <UserRound size={13} />
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[10px] font-semibold leading-tight text-ink">Admin</span>
              <span className="block text-[9px] leading-tight text-muted">admin@talknestbd.com</span>
            </span>
            <ChevronDown size={13} className="text-muted" />
          </button>

          {menuOpen && (
            <>
              <button
                type="button"
                aria-label="Close account menu"
                onClick={() => setMenuOpen(false)}
                className="fixed inset-0 z-40 cursor-default"
              />
              <div className="absolute right-0 top-11 z-50 w-52 overflow-hidden rounded-[8px] border border-line bg-white shadow-[0_18px_45px_-30px_rgba(11,61,122,0.6)]">
                <div className="border-b border-line px-3 py-2.5">
                  <p className="text-[11px] font-semibold text-ink">Signed in as Admin</p>
                  <p className="text-[9px] text-muted">Demo session</p>
                </div>
                <Link
                  href="/"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] text-ink transition-colors hover:bg-brand-50"
                >
                  <ExternalLink size={13} /> View storefront
                </Link>
                <button
                  type="button"
                  onClick={signOut}
                  className="flex w-full items-center gap-2 border-t border-line px-3 py-2.5 text-[11px] text-clay-600 transition-colors hover:bg-clay-500/5"
                >
                  <LogOut size={13} /> Sign out
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
