import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BooksExplorer } from "@/components/books/BooksExplorer";

export const metadata: Metadata = {
  title: "All Books",
  description:
    "The complete TalkNest BD collection — novels, literature, Islamic history, biographies, student books and international titles.",
};

export default function BooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book Collection"
        title="Your next favourite book is here"
        description="A curated collection of 24 books. Browse by category, price or popularity to find the right one for you."
        crumbs={[{ label: "All Books" }]}
      />
      <section className="py-8 sm:py-12">
        <Container>
          <BooksExplorer />
        </Container>
      </section>
    </>
  );
}
