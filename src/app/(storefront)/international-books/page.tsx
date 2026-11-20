import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";
import { getInternationalShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "International Books",
  description: "World literature, modern classics and translations for curious readers.",
};

export default async function InternationalBooksPage() {
  const content = await getInternationalShelfContent();
  return (
    <ShelfPageContent
      slug="international"
      tag="international"
      crumb="International Books"
      content={content}
    />
  );
}
