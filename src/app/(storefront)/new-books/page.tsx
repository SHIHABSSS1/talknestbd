import type { Metadata } from "next";
import { NewArrivalsPageContent } from "@/components/books/NewArrivalsPageContent";
import { getNewArrivalsShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "New Arrivals",
  description: "Recently published books and new additions to the TalkNest BD collection.",
};

export default async function NewBooksPage() {
  const content = await getNewArrivalsShelfContent();
  return <NewArrivalsPageContent content={content} />;
}
