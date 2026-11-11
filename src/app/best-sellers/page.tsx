import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "বেস্ট সেলার বই",
  description: "পাঠকদের সবচেয়ে প্রিয় ও সর্বাধিক বিক্রিত বইয়ের তালিকা।",
};

export default function BestSellersPage() {
  return <CollectionPage collection="bestseller" />;
}
