import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CategoryBookRails } from "@/components/home/CategoryBookRails";
import { ViralRail } from "@/components/home/ViralRail";
import { SellUsedBooksBanner } from "@/components/home/SellUsedBooksBanner";
import { UpSaleRail } from "@/components/home/UpSaleRail";
import { FreeOrderWholesale } from "@/components/home/FreeOrderWholesale";
import { AudioShowcase } from "@/components/home/AudioShowcase";
import { SunnahShowcase } from "@/components/home/SunnahShowcase";
import { UsedBooksBanner } from "@/components/home/UsedBooksBanner";
import { AuthorsSpotlight } from "@/components/home/AuthorsSpotlight";
import { PublishersStrip } from "@/components/home/PublishersStrip";
import { ReviewsWall } from "@/components/home/ReviewsWall";
import { VideoQuizSection } from "@/components/home/VideoQuizSection";
import { StoryCommunity } from "@/components/home/StoryCommunity";
import { BookRail } from "@/components/books/BookRail";
import { getBooksByCollection } from "@/data/books";

export default function HomePage() {
  const newBooks = getBooksByCollection("new");
  const internationalBooks = getBooksByCollection("international");
  const studentBooks = getBooksByCollection("student");

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryShowcase />
      <CategoryBookRails />

      <SellUsedBooksBanner />
      <UpSaleRail />
      <UsedBooksBanner />

      <BookRail
        books={newBooks}
        eyebrow="New Arrivals"
        title="Fresh off the press"
        description="Newly published and newly added — the latest books on our shelves."
        href="/new-books"
        linkLabel="All new arrivals"
        tone="soft"
      />

      <FreeOrderWholesale />

      <ViralRail />

      <AudioShowcase />
      <SunnahShowcase />

      <BookRail
        books={internationalBooks}
        eyebrow="International"
        title="World literature, within reach"
        description="Global bestsellers, modern classics and translations for curious readers."
        href="/international-books"
        linkLabel="All world literature"
        tone="soft"
      />

      <AuthorsSpotlight />
      <PublishersStrip />

      <BookRail
        books={studentBooks}
        eyebrow="Student Books"
        title="Books for every study day"
        description="Study guides, reference books and skill-builders for exams and beyond."
        href="/student-books"
        linkLabel="All student books"
      />

      <ReviewsWall />
      <VideoQuizSection />
      <StoryCommunity />
    </>
  );
}
