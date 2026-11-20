import type { Metadata } from "next";
import { ViralPageContent } from "@/components/books/ViralPageContent";
import { getViralShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "Viral Books",
  description: "The books everyone is talking about at TalkNest BD.",
};

/** Legacy URL — now shows the Viral Books shelf. */
export default async function BestSellersPage() {
  const content = await getViralShelfContent();
  return <ViralPageContent content={content} />;
}
