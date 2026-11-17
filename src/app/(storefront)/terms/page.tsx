import type { Metadata } from "next";
import { termsDocument } from "@/data/legal";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "TalkNest BD terms for orders, payments, delivery and use of the site.",
};

export default function TermsPage() {
  return <LegalDocument document={termsDocument} />;
}
