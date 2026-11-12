import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { BuybackBanner } from "@/components/home/BuybackBanner";
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
  const bestsellers = getBooksByCollection("bestseller");
  const newBooks = getBooksByCollection("new");
  const viralBooks = getBooksByCollection("viral");
  const internationalBooks = getBooksByCollection("international");
  const studentBooks = getBooksByCollection("student");

  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryShowcase />

      <BookRail
        books={bestsellers}
        eyebrow="Best Sellers"
        title="The books readers love most"
        description="The titles that keep finding new readers, month after month."
        href="/best-sellers"
        linkLabel="All bestsellers"
      />

      <BuybackBanner />

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

      <BookRail
        books={viralBooks}
        eyebrow="Trending Now"
        title="Books everyone is talking about"
        description="The titles moving through reading groups, social feeds and dinner conversations."
        href="/viral-books"
        linkLabel="All trending books"
      />

      <AudioShowcase />
      <SunnahShowcase />
      <UsedBooksBanner />

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
