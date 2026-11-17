import type { Metadata } from "next";
import { AdminProfile } from "@/components/admin/AdminProfile";

export const metadata: Metadata = {
  title: "Admin profile",
};

export default function AdminProfilePage() {
  return <AdminProfile />;
}
