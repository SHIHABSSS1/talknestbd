"use client";

import { useReviews } from "@/components/providers/ReviewsProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ReviewsExplorer } from "@/components/reviews/ReviewsExplorer";
import { formatCount } from "@/lib/utils";

export function ReviewsPageContent() {
  const { content } = useReviews();
  const { page } = content;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        crumbs={[{ label: "Customer Reviews" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
            {formatCount(Number(page.reviewCount))}{page.pills[0]}
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
            {page.ratingValue}{page.pills[1]}
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
            {page.pills[2]}
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
