import type { Metadata } from "next";
import { ProfileSettings } from "@/components/account/ProfileSettings";

export const instant = false;

export const metadata: Metadata = {
  title: "Settings",
};

export default function AccountSettingsPage() {
  return <ProfileSettings />;
}
