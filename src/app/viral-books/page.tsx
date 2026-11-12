import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "Trending Books",
  description: "Popular books spreading through reader conversations and social media.",
};

export default function ViralBooksPage() {
  return <CollectionPage collection="viral" />;
}
