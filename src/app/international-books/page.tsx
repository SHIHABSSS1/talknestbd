import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "আন্তর্জাতিক বই",
  description: "বিশ্বসাহিত্য ও আন্তর্জাতিক বেস্টসেলারের বাছাই করা বাংলা সংস্করণ।",
};

export default function InternationalBooksPage() {
  return <CollectionPage collection="international" />;
}
