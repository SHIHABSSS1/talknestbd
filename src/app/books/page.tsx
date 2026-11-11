import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BooksExplorer } from "@/components/books/BooksExplorer";

export const metadata: Metadata = {
  title: "সব বই",
  description:
    "TalkNest BD-এর সম্পূর্ণ বইয়ের সংগ্রহ — উপন্যাস, সাহিত্য, ইসলামিক ইতিহাস, জীবনী, স্টুডেন্ট বুকস ও আন্তর্জাতিক বই।",
};

export default function BooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Book Collection"
        title="আপনার পরের প্রিয় বইটি এখানে"
        description="২৪টি বাছাই করা বইয়ের সম্পূর্ণ সংগ্রহ। ক্যাটাগরি, দাম বা জনপ্রিয়তা অনুযায়ী খুঁজে নিন আপনার পছন্দের বইটি।"
        crumbs={[{ label: "সব বই" }]}
      />
      <section className="py-8 sm:py-12">
        <Container>
          <BooksExplorer />
        </Container>
      </section>
    </>
  );
}
