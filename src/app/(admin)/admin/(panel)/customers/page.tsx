// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { CustomersManager } from "@/components/admin/CustomersManager";

export const metadata: Metadata = {
  title: "Customers",
};

export default function AdminCustomersPage() {
  return <CustomersManager />;
}
