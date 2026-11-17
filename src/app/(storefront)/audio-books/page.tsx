import type { Metadata } from "next";
import { AudioPageContent } from "@/components/audio/AudioPageContent";

export const metadata: Metadata = {
  title: "Audiobooks",
  description:
    "Free and premium audiobooks with chapter previews — listen to stories, non-fiction and the Seerah.",
};

export default function AudioBooksPage() {
  return <AudioPageContent />;
}
