import type { Metadata } from "next";
import { returnDocument } from "@/data/legal";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Return & Refund Policy",
  description: "TalkNest BD rules for book returns, exchanges, refunds and 50% buyback.",
};

export default function ReturnPolicyPage() {
  return <LegalDocument document={returnDocument} />;
}
