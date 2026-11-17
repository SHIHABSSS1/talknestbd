import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Recently published books and new additions to the TalkNest BD collection.",
};

export default function NewBooksPage() {
  return <CollectionPage collection="new" />;
}
