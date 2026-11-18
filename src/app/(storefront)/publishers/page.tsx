import type { Metadata } from "next";
import { PublishersPageContent } from "@/components/publishers/PublishersPageContent";

export const metadata: Metadata = {
  title: "Publishers",
  description: "Curated publisher catalogues, their stories and collections — all in one place.",
};

export default function PublishersPage() {
  return <PublishersPageContent />;
}
