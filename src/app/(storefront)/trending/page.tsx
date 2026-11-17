import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";

export const metadata: Metadata = {
  title: "Trending Now",
  description: "Books everyone is talking about at TalkNest BD.",
};

export default function TrendingPage() {
  return <ShelfPageContent slug="trending" tag="trending" crumb="Trending Now" />;
}
