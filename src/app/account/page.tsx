import type { Metadata } from "next";
import { AccountOverview } from "@/components/account/AccountOverview";

export const metadata: Metadata = {
  title: "ড্যাশবোর্ড",
};

export default function AccountPage() {
  return <AccountOverview />;
}
