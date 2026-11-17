import type { Metadata } from "next";
import { AdminShell } from "@/components/admin/AdminShell";

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin — TalkNest BD",
  },
  description: "TalkNest BD admin panel — manage sections, books and content.",
};

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}
