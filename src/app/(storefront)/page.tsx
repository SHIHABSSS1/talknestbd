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
import { getHeroContent } from "@/lib/db/queries/hero";
import { getTrustContent } from "@/lib/db/queries/trust-strip";
import {
  getUpSaleShelfContent,
  getViralShelfContent,
} from "@/lib/db/queries/shelves";

export default async function HomePage() {
  // Cached content blocks; the admin save actions expire these tags.
  const [hero, trust, viral, upSale] = await Promise.all([
    getHeroContent(),
    getTrustContent(),
    getViralShelfContent(),
    getUpSaleShelfContent(),
  ]);

  return (
    <>
      <Hero banners={hero.banners} />
      <TrustStrip content={trust} />
      <CategoryShowcase />
      <CategoryBookRails />

      <SellUsedBooksBanner />
      <UpSaleRail content={upSale} />
      <UsedBooksBanner />

      <NewArrivalsRail />

      <FreeOrderWholesale />

      <ViralRail content={viral} />

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