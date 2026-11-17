import type { Metadata } from "next";
import { WholesalePageContent } from "@/components/services/WholesalePageContent";

export const metadata: Metadata = {
  title: "Wholesale Orders",
  description:
    "Libraries, schools, mosques, clubs and businesses can order books in bulk with special commissions from 10 copies.",
};

export default function WholesalePage() {
  return <WholesalePageContent />;
}
