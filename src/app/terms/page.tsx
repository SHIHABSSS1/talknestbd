import type { Metadata } from "next";
import { termsDocument } from "@/data/legal";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "শর্তাবলি",
  description: "TalkNest BD-এর অর্ডার, পেমেন্ট, ডেলিভারি ও ব্যবহারের শর্তাবলি।",
};

export default function TermsPage() {
  return <LegalDocument document={termsDocument} />;
}
