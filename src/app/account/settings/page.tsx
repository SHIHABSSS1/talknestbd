import type { Metadata } from "next";
import { ProfileSettings } from "@/components/account/ProfileSettings";

export const metadata: Metadata = {
  title: "সেটিংস",
};

export default function AccountSettingsPage() {
  return <ProfileSettings />;
}
