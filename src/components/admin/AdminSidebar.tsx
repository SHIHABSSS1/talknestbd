"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect } from "react";
import { BookOpen, X } from "lucide-react";
import { adminNavGroups } from "@/lib/admin-nav";

export function AdminSidebar({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  useEffect(() => {
    onClose();
  }, [pathname, onClose]);

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
          {adminNavGroups.map((group) => (
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

      </aside>
    </>
  );
}
