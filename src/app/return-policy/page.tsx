import type { Metadata } from "next";
import { returnDocument } from "@/data/legal";
import { LegalDocument } from "@/components/legal/LegalDocument";

export const metadata: Metadata = {
  title: "রিটার্ন ও রিফান্ড পলিসি",
  description: "TalkNest BD বই রিটার্ন, বিনিময়, রিফান্ড ও ৫০% বাইব্যাকের নিয়ম।",
};

export default function ReturnPolicyPage() {
  return <LegalDocument document={returnDocument} />;
}
