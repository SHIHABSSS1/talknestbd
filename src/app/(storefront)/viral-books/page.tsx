import type { Metadata } from "next";
import { ViralPageContent } from "@/components/books/ViralPageContent";

export const metadata: Metadata = {
  title: "Viral Books",
  description: "The books everyone is talking about at TalkNest BD.",
};

export default function ViralBooksPage() {
  return <ViralPageContent />;
}
