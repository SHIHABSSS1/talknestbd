// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { OrdersManager } from "@/components/admin/OrdersManager";

export const metadata: Metadata = {
  title: "Orders",
};

export default function AdminOrdersPage() {
  return <OrdersManager />;
}
