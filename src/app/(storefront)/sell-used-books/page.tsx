import type { Metadata } from "next";
import { SellUsedBooksPageContent } from "@/components/services/SellUsedBooksPageContent";
import { getSellContent } from "@/lib/db/queries/sell";

/**
 * Metadata follows the same database document as the page copy, so an admin
 * edit to the hero title/description is reflected in the served HTML.
 */
export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getSellContent();
  return {
    title: page.hero.title || "Sell Used Books — 50% Cash Back",
    description: page.hero.description,
  };
}

export default function SellUsedBooksPage() {
  return <SellUsedBooksPageContent />;
}
