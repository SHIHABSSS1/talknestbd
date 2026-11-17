import type { Metadata } from "next";
import { SiteSettings } from "@/components/admin/SiteSettings";

export const metadata: Metadata = {
  title: "Site settings",
};

export default function AdminSettingsPage() {
  return <SiteSettings />;
}
