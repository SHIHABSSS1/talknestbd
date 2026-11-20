import type { Metadata } from "next";
import { WholesalePageContent } from "@/components/services/WholesalePageContent";
import { getWholesaleContent } from "@/lib/db/queries/wholesale";

export async function generateMetadata(): Promise<Metadata> {
  const { page } = await getWholesaleContent();
  return {
    title: page.hero.title,
    description: page.hero.description,
  };
}

export default function WholesalePage() {
  return <WholesalePageContent />;
}
