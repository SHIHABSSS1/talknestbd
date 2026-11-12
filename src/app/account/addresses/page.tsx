import type { Metadata } from "next";
import { AddressManager } from "@/components/account/AddressManager";

export const metadata: Metadata = {
  title: "Saved Addresses",
};

export default function AccountAddressesPage() {
  return <AddressManager />;
}
