import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";

export const metadata: Metadata = {
  title: "International Books",
  description: "World literature, modern classics and translations for curious readers.",
};

export default function InternationalBooksPage() {
  return (
    <ShelfPageContent
      slug="international"
      tag="international"
      crumb="International Books"
    />
  );
}
