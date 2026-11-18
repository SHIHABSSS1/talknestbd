import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BooksExplorer } from "@/components/books/BooksExplorer";
import { formatPrice, siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "All Books",
  description:
    "The complete TalkNest BD collection — novels, literature, Islamic history, biographies, student books and international titles. Filter by category, price, publisher and more.",
};

const headerPills = [
  "Every shelf, one place",
  `Free delivery over ${formatPrice(siteConfig.freeDeliveryThreshold)}`,
  `${siteConfig.sellUsedBookRate}% back after you read`,
];

export default function BooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book collection"
        title="Find your next great read"
        description="Novels, literature, Islamic history, biographies, study guides and world classics — narrow the whole TalkNest shelf by category, price, publisher and more."
        crumbs={[{ label: "All Books" }]}
      >
        <div className="flex flex-wrap gap-2 text-[11px]">
          {headerPills.map((pill) => (
            <span
              key={pill}
              className="rounded-full border border-line bg-canvas px-3 py-1.5 font-medium text-body"
            >
              {pill}
            </span>
          ))}
        </div>
      </PageHeader>
      <section className="py-8 sm:py-12">
        <Container>
          <BooksExplorer />
        </Container>
      </section>
    </>
  );
}
