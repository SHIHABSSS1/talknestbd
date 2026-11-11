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
        title="সবচেয়ে প্রিয় বইগুলো"
        description="পাঠকদের ভালোবাসায় বারবার ফিরে আসা বইয়ের তালিকা।"
        href="/best-sellers"
      />

      <BuybackBanner />

      <BookRail
        books={newBooks}
        eyebrow="New Arrivals"
        title="এই মাসের নতুন বই"
        description="সদ্য প্রকাশিত ও সংগ্রহে নতুন যোগ হওয়া বইগুলো।"
        href="/new-books"
        tone="soft"
      />

      <BookRail
        books={viralBooks}
        eyebrow="Viral Books"
        title="সোশ্যালে আলোচিত বই"
        description="পাঠকদের মুখে মুখে ছড়িয়ে পড়া বই, যেগুলো এখন সবাই পড়ছে।"
        href="/viral-books"
      />

      <FreeOrderWholesale />

      <BookRail
        books={internationalBooks}
        eyebrow="International"
        title="বিশ্বসাহিত্য ও অনুবাদ"
        description="বিশ্বজুড়ে পাঠকপ্রিয় বইয়ের বাংলা ও ইংরেজি সংস্করণ।"
        href="/international-books"
        tone="soft"
      />

      <BookRail
        books={studentBooks}
        eyebrow="Student Books"
        title="পড়াশোনার সঙ্গী"
        description="একাডেমিক প্রস্তুতি, দক্ষতা ও ক্যারিয়ারের জন্য নির্বাচিত বই।"
        href="/student-books"
      />

      <AudioShowcase />
      <SunnahShowcase />
      <UsedBooksBanner />
      <AuthorsSpotlight />
      <PublishersStrip />
      <ReviewsWall />
      <VideoQuizSection />
      <StoryCommunity />
    </>
  );
}
