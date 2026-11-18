import type { Metadata } from "next";
import { StoriesPageContent } from "@/components/stories/StoriesPageContent";

export const metadata: Metadata = {
  title: "Reader Stories",
  description: "Real stories from TalkNest BD readers — written, spoken or shared as a PDF diary.",
};

export default function StoriesPage() {
  return <StoriesPageContent />;
}
