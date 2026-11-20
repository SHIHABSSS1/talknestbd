import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";
import { getTrendingShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "Trending Now",
  description: "Books everyone is talking about at TalkNest BD.",
};

export default async function TrendingPage() {
  const content = await getTrendingShelfContent();
  return (
    <ShelfPageContent
      slug="trending"
      tag="trending"
      crumb="Trending Now"
      content={content}
    />
  );
}
