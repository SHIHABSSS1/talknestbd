import type { Metadata } from "next";
import { VideoPageContent } from "@/components/video/VideoPageContent";

export const metadata: Metadata = {
  title: "Videos & Podcast",
  description: "Conversations about books, authors and stories — watch episodes and take the quiz.",
};

export default function VideoPage() {
  return <VideoPageContent />;
}
