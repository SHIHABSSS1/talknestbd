"use client";

import Link from "next/link";
import { ArrowUpRight, Bell, CheckCircle2, Info, TriangleAlert } from "lucide-react";
import { useNotifications } from "@/components/providers/NotificationsProvider";
import type { NotificationTone } from "@/lib/notifications";
import { cn } from "@/lib/utils";

const toneStyles: Record<
  NotificationTone,
  { icon: typeof Bell; className: string }
> = {
  info: { icon: Info, className: "bg-brand-50 text-brand-700" },
  success: { icon: CheckCircle2, className: "bg-mint/25 text-forest-700" },
  warning: { icon: TriangleAlert, className: "bg-gold-300/25 text-gold-600" },
};

export function NotificationsView() {
  const { notifications, unreadCount, markRead, markAllRead } = useNotifications();

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">Notifications</h1>
          <p className="mt-1 text-[12px] text-muted">
            {unreadCount} unread · updates from your admin workspace.
          </p>
        </div>
        <button
          type="button"
          onClick={markAllRead}
          className="inline-flex h-9 items-center gap-1.5 rounded-[4px] bg-brand-600 px-4 text-[11px] font-semibold text-white hover:bg-brand-700"
        >
          <CheckCircle2 size={13} /> Mark all as read
        </button>
      </div>

      <section className="overflow-hidden rounded-[10px] border border-line bg-white">
        {notifications.length === 0 ? (
          <p className="px-4 py-10 text-center text-[11px] text-muted">
            No notifications yet.
          </p>
        ) : (
          notifications.map((item) => {
            const tone = toneStyles[item.tone];
            const Icon = tone.icon;
            return (
              <Link
                key={item.id}
                href={item.href ?? "/admin"}
                onClick={() => markRead(item.id)}
                className={cn(
                  "flex items-start gap-3 border-b border-line/70 px-4 py-4 transition-colors last:border-0 hover:bg-brand-50/60",
                  !item.read && "bg-brand-50/40",
                )}
              >
                <span
                  className={cn(
                    "grid h-9 w-9 shrink-0 place-items-center rounded-[7px]",
                    tone.className,
                  )}
                >
                  <Icon size={15} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-ink">
                      {item.title}
                    </span>
                    {!item.read && (
                      <span className="rounded-full bg-sale px-1.5 py-0.5 text-[8px] font-bold text-ink">
                        New
                      </span>
                    )}
                  </span>
                  <span className="mt-1 block text-[11px] leading-relaxed text-muted">
                    {item.detail}
                  </span>
                  <span className="mt-1 block text-[9px] text-muted/70">
                    {item.time}
                  </span>
                </span>
                <ArrowUpRight size={14} className="mt-1 shrink-0 text-muted/50" />
              </Link>
            );
          })
        )}
      </section>

      <p className="text-[10px] text-muted">
        Storage note: notifications are sample updates stored in this browser only.
      </p>
    </div>
  );
}
