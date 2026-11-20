import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";
import { getSunnahShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "Sunnah Essentials",
  description: "A considered collection of books for daily Sunnah practice.",
};

export default async function SunnahPage() {
  const content = await getSunnahShelfContent();
  return (
    <ShelfPageContent
      slug="sunnah"
      tag="sunnah"
      crumb="Sunnah Essentials"
      content={content}
    />
  );
}
