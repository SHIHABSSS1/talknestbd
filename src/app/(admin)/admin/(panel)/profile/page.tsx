// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { AdminProfile } from "@/components/admin/AdminProfile";

export const metadata: Metadata = {
  title: "Admin profile",
};

export default function AdminProfilePage() {
  return <AdminProfile />;
}
