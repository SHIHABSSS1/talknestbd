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
  Settings2,
  UserRound,
} from "lucide-react";
import { authClient } from "@/lib/auth-client";
import { useNotifications } from "@/components/providers/NotificationsProvider";
import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import { initials } from "@/lib/admin-access";

export function AdminHeader({ onMenuClick }: { onMenuClick: () => void }) {
  const router = useRouter();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();
  const { currentUser, currentRole, isSuperAdmin } = useAdminAccess();

  const signOut = async () => {
    await authClient.signOut();
    setMenuOpen(false);
    router.push("/admin/login");
    router.refresh();
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
        <p className="hidden text-[10px] text-muted sm:block">TalkNest BD</p>
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

        <div
          className="relative"
          onMouseEnter={() => setNotificationsOpen(true)}
          onMouseLeave={() => setNotificationsOpen(false)}
        >
          <button
            type="button"
            aria-label="Notifications"
            aria-expanded={notificationsOpen}
            onClick={() => setNotificationsOpen((value) => !value)}
            className="relative grid h-9 w-9 place-items-center rounded-[4px] border border-line text-ink transition-colors hover:bg-brand-50 hover:text-brand-700"
          >
            <Bell size={15} />
            {unreadCount > 0 && (
              <span className="absolute -right-1.5 -top-1.5 grid h-4 min-w-4 place-items-center rounded-full bg-sale px-1 text-[8px] font-bold leading-none text-ink">
                {unreadCount}
              </span>
            )}
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 top-11 z-50 w-80 overflow-hidden rounded-[8px] border border-line bg-white shadow-[0_18px_45px_-30px_rgba(11,61,122,0.6)] animate-fade-up">
              <div className="flex items-center justify-between gap-2 border-b border-line px-3 py-2.5">
                <div>
                  <p className="text-[11px] font-semibold text-ink">Notifications</p>
                  <p className="text-[9px] text-muted">
                    {unreadCount} unread
                  </p>
                </div>
                <button
                  type="button"
                  onClick={markAllRead}
                  className="text-[10px] font-semibold text-brand-700 hover:underline"
                >
                  Mark all read
                </button>
              </div>
              <div className="max-h-80 overflow-y-auto">
                {notifications.slice(0, 5).map((item) => (
                  <Link
                    key={item.id}
                    href={item.href ?? "/admin/notifications"}
                    onClick={() => {
                      markRead(item.id);
                      setNotificationsOpen(false);
                    }}
                    className={`flex gap-2 border-b border-line/70 px-3 py-2.5 transition-colors last:border-0 hover:bg-brand-50 ${
                      item.read ? "bg-white" : "bg-brand-50/40"
                    }`}
                  >
                    <span
                      className={`mt-1 h-1.5 w-1.5 shrink-0 rounded-full ${
                        item.read ? "bg-line" : "bg-sale"
                      }`}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-[10px] font-semibold text-ink">
                        {item.title}
                      </span>
                      <span className="mt-0.5 block text-[9px] leading-relaxed text-muted">
                        {item.detail}
                      </span>
                      <span className="mt-0.5 block text-[8px] text-muted/70">
                        {item.time}
                      </span>
                    </span>
                  </Link>
                ))}
              </div>
              <Link
                href="/admin/notifications"
                onClick={() => setNotificationsOpen(false)}
                className="block border-t border-line px-3 py-2.5 text-center text-[10px] font-semibold text-brand-700 hover:bg-brand-50"
              >
                View all notifications
              </Link>
            </div>
          )}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => setMenuOpen((value) => !value)}
            aria-expanded={menuOpen}
            aria-label="Account menu"
            className="flex h-9 items-center gap-2 rounded-[4px] border border-line pl-1.5 pr-2 transition-colors hover:bg-brand-50"
          >
            <span className="grid h-6 w-6 place-items-center overflow-hidden rounded-full bg-brand-600 text-[8px] font-bold text-white">
              {currentUser?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.image} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(currentUser?.name ?? "Admin")
              )}
            </span>
            <span className="hidden text-left sm:block">
              <span className="block text-[10px] font-semibold leading-tight text-ink">
                {currentUser?.name ?? "Admin"}
              </span>
              <span className="block text-[9px] leading-tight text-muted">
                {currentUser?.email ?? "admin@talknestbd.com"}
              </span>
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
                  <p className="text-[11px] font-semibold text-ink">
                    {currentUser?.name ?? "Admin"}
                  </p>
                  <p className="text-[9px] text-muted">
                    {currentUser?.roleName ?? currentRole?.name ?? "Admin role"}
                  </p>
                </div>
                <Link
                  href="/admin/profile"
                  onClick={() => setMenuOpen(false)}
                  className="flex items-center gap-2 px-3 py-2.5 text-[11px] text-ink transition-colors hover:bg-brand-50"
                >
                  <UserRound size={13} /> Admin profile
                </Link>
                {isSuperAdmin && (
                  <Link
                    href="/admin/users"
                    onClick={() => setMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2.5 text-[11px] text-ink transition-colors hover:bg-brand-50"
                  >
                    <Settings2 size={13} /> Users &amp; roles
                  </Link>
                )}
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
