import type { Metadata } from "next";
import { SellUsedBooksPageContent } from "@/components/services/SellUsedBooksPageContent";

export const metadata: Metadata = {
  title: "Sell Used Books — 50% Cash Back",
  description:
    "Finished a book you bought from TalkNest BD? Sell it to us and get up to 50% of the purchase price in cash. Simple used-book selling process and calculator.",
};

export default function SellUsedBooksPage() {
  return <SellUsedBooksPageContent />;
}
