import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "নতুন বই",
  description: "সদ্য প্রকাশিত ও TalkNest BD-এর সংগ্রহে নতুন যোগ হওয়া বই।",
};

export default function NewBooksPage() {
  return <CollectionPage collection="new" />;
}
