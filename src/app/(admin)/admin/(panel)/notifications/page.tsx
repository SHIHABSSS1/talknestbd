// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { NotificationsView } from "@/components/admin/NotificationsView";

export const metadata: Metadata = {
  title: "Notifications",
};

export default function AdminNotificationsPage() {
  return <NotificationsView />;
}
