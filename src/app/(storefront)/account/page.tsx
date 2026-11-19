import type { Metadata } from "next";
import { AccountOverview } from "@/components/account/AccountOverview";

export const instant = false;

export const metadata: Metadata = {
  title: "Dashboard",
};

export default function AccountPage() {
  return <AccountOverview />;
}
