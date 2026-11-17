import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "Best Sellers",
  description: "The most loved and most purchased books at TalkNest BD.",
};

export default function BestSellersPage() {
  return <CollectionPage collection="bestseller" />;
}
