import type { Metadata } from "next";
import { NewArrivalsPageContent } from "@/components/books/NewArrivalsPageContent";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Recently published books and new additions to the TalkNest BD collection.",
};

export default function NewBooksPage() {
  return <NewArrivalsPageContent />;
}
