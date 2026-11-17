import type { Metadata } from "next";
import { HeartHandshake, MessageSquareHeart, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ReviewsExplorer } from "@/components/reviews/ReviewsExplorer";
import { formatCount } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Customer Reviews",
  description:
    "Real experiences from TalkNest BD readers — read reviews of books, delivery, packaging and service, or share your own.",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reader Reviews"
        title="Reader voices, our promise"
        description="Every review teaches us something, and every opinion helps the next reader. Learn from other readers before you buy, then share how your own experience went."
        crumbs={[{ label: "Customer Reviews" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            <Star size={11} className="fill-gold-500 text-gold-500" />
            {formatCount(1240)}+ verified reviews
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            <HeartHandshake size={11} /> 4.9 average rating
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            <MessageSquareHeart size={11} /> 100% reader opinions
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <ReviewsExplorer />
        </Container>
      </section>
    </>
  );
}
