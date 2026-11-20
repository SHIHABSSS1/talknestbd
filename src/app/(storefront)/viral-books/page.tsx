import type { Metadata } from "next";
import { ViralPageContent } from "@/components/books/ViralPageContent";
import { getViralShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "Viral Books",
  description: "The books everyone is talking about at TalkNest BD.",
};

export default async function ViralBooksPage() {
  const content = await getViralShelfContent();
  return <ViralPageContent content={content} />;
}
