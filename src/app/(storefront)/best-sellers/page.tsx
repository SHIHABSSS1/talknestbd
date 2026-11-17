import type { Metadata } from "next";
import { ViralPageContent } from "@/components/books/ViralPageContent";

export const metadata: Metadata = {
  title: "Viral Books",
  description: "The books everyone is talking about at TalkNest BD.",
};

/** Legacy URL — now shows the Viral Books shelf. */
export default function BestSellersPage() {
  return <ViralPageContent />;
}
