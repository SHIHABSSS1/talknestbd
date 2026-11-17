import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "International Books",
  description: "Selected world literature and international bestsellers.",
};

export default function InternationalBooksPage() {
  return <CollectionPage collection="international" />;
}
