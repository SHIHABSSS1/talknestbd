import type { Metadata } from "next";
import { privacyDocument } from "@/data/legal";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How TalkNest BD collects, uses and stores reader information.",
};

export default function PrivacyPage() {
  return <LegalDocument document={privacyDocument} />;
}
