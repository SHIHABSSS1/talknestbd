import type { Metadata } from "next";

import { FreeOrderPageContent } from "@/components/services/FreeOrderPageContent";
import { getWholesaleContent } from "@/lib/db/queries/wholesale";

export async function generateMetadata(): Promise<Metadata> {
  const { freeOrderPage } = await getWholesaleContent();
  return {
    title: freeOrderPage.hero.title || "Free Delivery",
    description: freeOrderPage.hero.description,
  };
}

export default function FreeOrderPage() {
  return <FreeOrderPageContent />;
}
