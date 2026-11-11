import type { Metadata } from "next";
import { AddressManager } from "@/components/account/AddressManager";

export const metadata: Metadata = {
  title: "সংরক্ষিত ঠিকানা",
};

export default function AccountAddressesPage() {
  return <AddressManager />;
}
