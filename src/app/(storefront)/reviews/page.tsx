import type { Metadata } from "next";
import { ReviewsPageContent } from "@/components/reviews/ReviewsPageContent";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description: "Real experiences from TalkNest BD readers — read reviews of books, delivery, packaging and service, or share your own.",
};

export default function ReviewsPage() {
  return <ReviewsPageContent />;
}
