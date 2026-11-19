"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, LogIn, LogOut, ShieldCheck, X } from "lucide-react";
import { useAdminAccess } from "@/components/providers/AdminAccessProvider";
import { authClient } from "@/lib/auth-client";
import { initials } from "@/lib/admin-access";

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { visibleNavGroups, currentUser, isSuperAdmin } = useAdminAccess();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

  const signOut = async () => {
    await authClient.signOut();
    onClose();
    router.push("/admin/login");
    router.refresh();
  };

  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={onClose}
          className="fixed inset-0 z-40 bg-ink/40 lg:hidden"
        />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-line bg-white transition-transform duration-200 lg:translate-x-0 ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Brand */}
        <div className="flex h-16 shrink-0 items-center gap-2.5 border-b border-line px-4">
          <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[7px] bg-brand-600 text-white">
            <BookOpen size={16} />
          </span>
          <div className="min-w-0">
            <p className="truncate font-display text-[13px] font-bold leading-tight text-ink">
              TalkNest BD
            </p>
            <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-brand-600">
              Admin panel
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close navigation"
            className="ml-auto grid h-8 w-8 shrink-0 place-items-center rounded-[4px] text-muted hover:bg-brand-50 hover:text-ink lg:hidden"
          >
            <X size={16} />
          </button>
        </div>

        {/* Navigation */}
        <nav aria-label="Admin navigation" className="min-h-0 flex-1 overflow-y-auto px-3 py-4">
          {visibleNavGroups.map((group) => (
            <div key={group.label} className="mb-5">
              <p className="mb-1.5 px-2 text-[9px] font-semibold uppercase tracking-[0.16em] text-muted/80">
                {group.label}
              </p>
              <ul className="space-y-0.5">
                {group.items.map((item) => {
                  const active =
                    pathname === item.href ||
                    (item.href === "/admin" && pathname === "/admin");
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`flex items-center gap-2.5 rounded-[5px] px-2.5 py-2 text-[11px] font-medium transition-colors ${
                          active
                            ? "bg-brand-50 text-brand-700"
                            : "text-body hover:bg-brand-50/60 hover:text-brand-700"
                        }`}
                      >
                        <item.icon
                          size={14}
                          className={active ? "text-brand-600" : "text-muted"}
                        />
                        <span className="truncate">{item.label}</span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Signed-in identity and session actions */}
        <div className="shrink-0 space-y-1.5 border-t border-line px-3 py-3">
          <Link
            href="/admin/profile"
            className="flex items-center gap-2.5 rounded-[6px] border border-line bg-brand-50/50 px-2.5 py-2 transition-colors hover:border-brand-200 hover:bg-brand-50"
          >
            <span className="grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-full bg-brand-600 text-[10px] font-bold text-white">
              {currentUser?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={currentUser.image} alt="" className="h-full w-full object-cover" />
              ) : (
                initials(currentUser?.name ?? "Admin")
              )}
            </span>
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[10px] font-semibold text-ink">
                {currentUser?.name ?? "Admin"}
              </span>
              <span className="block truncate text-[9px] text-muted">
                {currentUser?.roleName ?? "Admin"}
              </span>
            </span>
            {isSuperAdmin && <ShieldCheck size={14} className="shrink-0 text-brand-600" />}
          </Link>
          {currentUser ? (
            <button
              type="button"
              onClick={() => void signOut()}
              className="flex w-full items-center gap-2.5 rounded-[5px] px-2.5 py-2 text-[11px] font-medium text-muted transition-colors hover:bg-clay-500/5 hover:text-clay-600"
            >
              <LogOut size={14} /> Sign out
            </button>
          ) : (
            <Link
              href="/admin/login"
              className="flex w-full items-center gap-2.5 rounded-[5px] px-2.5 py-2 text-[11px] font-medium text-muted transition-colors hover:bg-brand-50 hover:text-brand-700"
            >
              <LogIn size={14} /> Sign in
            </Link>
          )}
        </div>
      </aside>
    </>
  );
}
