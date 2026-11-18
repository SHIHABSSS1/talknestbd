import type { Metadata } from "next";
import { SharePageContent } from "@/components/stories/SharePageContent";

export const metadata: Metadata = {
  title: "Share a Story",
  description: "Share a memory, a turning point or a small everyday joy with TalkNest BD readers.",
};

export default function ShareStoryPage() {
  return <SharePageContent />;
}
