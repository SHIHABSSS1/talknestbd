import type { Metadata } from "next";
import { AccountOrders } from "@/components/account/AccountOrders";

export const metadata: Metadata = {
  title: "আমার অর্ডার",
};

export default function AccountOrdersPage() {
  return <AccountOrders />;
}
