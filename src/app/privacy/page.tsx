import type { Metadata } from "next";
import { privacyDocument } from "@/data/legal";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "প্রাইভেসি পলিসি",
  description: "TalkNest BD কীভাবে পাঠকের তথ্য সংগ্রহ, ব্যবহার ও সংরক্ষণ করে।",
};

export default function PrivacyPage() {
  return <LegalDocument document={privacyDocument} />;
}
