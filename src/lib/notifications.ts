/** Demo admin notifications. Read/dismissed state is kept in localStorage. */

export type NotificationTone = "info" | "success" | "warning";

export interface AdminNotification {
  id: string;
  title: string;
  detail: string;
  time: string;
  tone: NotificationTone;
  href?: string;
}

export const NOTIFICATIONS_KEY = "talknestbd-admin-notifications-v1";

export const sampleNotifications: AdminNotification[] = [
  {
    id: "n1",
    title: "New sell request",
    detail: "A reader requested a sale from the calculator. Review their details.",
    time: "12 minutes ago",
    tone: "warning",
    href: "/admin/sections/sell-used-books",
  },
  {
    id: "n2",
    title: "Hero banner updated",
    detail: "Homepage banner copy and slides were saved in this browser.",
    time: "2 hours ago",
    tone: "success",
    href: "/admin/sections/hero",
  },
  {
    id: "n3",
    title: "New book added to Viral books",
    detail: "A book was uploaded to the Viral Books shelf.",
    time: "Today",
    tone: "info",
    href: "/admin/sections/viral-books",
  },
  {
    id: "n4",
    title: "Orders awaiting dispatch",
    detail: "3 demo orders are still being processed.",
    time: "Yesterday",
    tone: "warning",
    href: "/admin/orders",
  },
  {
    id: "n5",
    title: "Review approved",
    detail: "A reader review is now visible on the storefront.",
    time: "Yesterday",
    tone: "success",
    href: "/admin",
  },
];

export function readNotificationState(): { read: string[]; dismissed: string[] } {
  if (typeof window === "undefined") return { read: [], dismissed: [] };
  try {
    const raw = window.localStorage.getItem(NOTIFICATIONS_KEY);
    if (!raw) return { read: [], dismissed: [] };
    const parsed = JSON.parse(raw) as Partial<{
      read: string[];
      dismissed: string[];
    }>;
    return {
      read: Array.isArray(parsed.read) ? parsed.read : [],
      dismissed: Array.isArray(parsed.dismissed) ? parsed.dismissed : [],
    };
  } catch {
    return { read: [], dismissed: [] };
  }
}

export function writeNotificationState(state: {
  read: string[];
  dismissed: string[];
}): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(state));
  } catch {
    // localStorage may be unavailable — demo only.
  }
}
