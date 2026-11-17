import { Hero } from "@/components/home/Hero";
import { TrustStrip } from "@/components/home/TrustStrip";
import { CategoryShowcase } from "@/components/home/CategoryShowcase";
import { CategoryBookRails } from "@/components/home/CategoryBookRails";
import { ViralRail } from "@/components/home/ViralRail";
import { NewArrivalsRail } from "@/components/home/NewArrivalsRail";
import { ShelfRail } from "@/components/books/ShelfRail";
import { SellUsedBooksBanner } from "@/components/home/SellUsedBooksBanner";
import { UpSaleRail } from "@/components/home/UpSaleRail";
import { FreeOrderWholesale } from "@/components/home/FreeOrderWholesale";
import { AudioShowcase } from "@/components/home/AudioShowcase";
import { UsedBooksBanner } from "@/components/home/UsedBooksBanner";
import { AuthorsSpotlight } from "@/components/home/AuthorsSpotlight";
import { PublishersStrip } from "@/components/home/PublishersStrip";
import { ReviewsWall } from "@/components/home/ReviewsWall";
import { VideoQuizSection } from "@/components/home/VideoQuizSection";
import { StoryCommunity } from "@/components/home/StoryCommunity";

export default function HomePage() {
  return (
    <>
      <Hero />
      <TrustStrip />
      <CategoryShowcase />
      <CategoryBookRails />

      <SellUsedBooksBanner />
      <UpSaleRail />
      <UsedBooksBanner />

      <NewArrivalsRail />

      <FreeOrderWholesale />

      <ViralRail />

      <ShelfRail
        slug="trending"
        tag="trending"
        href="/trending"
      />

      <AudioShowcase />

      <ShelfRail
        slug="sunnah"
        tag="sunnah"
        href="/sunnah"
        tone="soft"
      />

      <ShelfRail
        slug="international"
        tag="international"
        href="/international-books"
        tone="soft"
      />

      <AuthorsSpotlight />
      <PublishersStrip />

      <ShelfRail
        slug="student-books"
        tag="student"
        href="/student-books"
      />

      <ReviewsWall />
      <VideoQuizSection />
      <StoryCommunity />
    </>
  );
}
