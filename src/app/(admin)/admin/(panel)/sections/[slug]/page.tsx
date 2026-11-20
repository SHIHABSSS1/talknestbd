// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AudioEditor } from "@/components/admin/AudioEditor";
import { AuthorsEditor } from "@/components/admin/AuthorsEditor";
import { PublishersEditor } from "@/components/admin/PublishersEditor";
import { ReviewsEditor } from "@/components/admin/ReviewsEditor";
import { StoriesEditor } from "@/components/admin/StoriesEditor";
import { VideoQuizEditor } from "@/components/admin/VideoQuizEditor";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { ShelfEditor, type ShelfConfig } from "@/components/admin/ShelfEditor";
import { ViralBooksEditor } from "@/components/admin/ViralBooksEditor";
import { TrustStripEditor } from "@/components/admin/TrustStripEditor";
import { UsedBooksEditor } from "@/components/admin/UsedBooksEditor";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { WholesaleEditor } from "@/components/admin/WholesaleEditor";
import { SellUsedBooksEditor } from "@/components/admin/SellUsedBooksEditor";
import { sectionDefaults, isKnownSection } from "@/lib/section-content";
import { findAdminNavItem } from "@/lib/admin-nav";
import { getHeroContent } from "@/lib/db/queries/hero";
import { getTrustContent } from "@/lib/db/queries/trust-strip";
import {
  getNewArrivalsShelfContent,
  getSunnahShelfContent,
  getTrendingShelfContent,
  getUpSaleShelfContent,
  getViralShelfContent,
} from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "Edit section",
};

function EditorSkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-8 w-56 animate-pulse rounded bg-white" />
      <div className="grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="h-96 animate-pulse rounded-[10px] border border-line bg-white" />
        <div className="h-64 animate-pulse rounded-[10px] border border-line bg-white" />
      </div>
    </div>
  );
}

function humanize(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function EditorLoader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  if (!isKnownSection(slug)) notFound();

  const label =
    findAdminNavItem(`/admin/sections/${slug}`)?.label ?? humanize(slug);

  // These sections render cards/slides, so they need dedicated editors.
  if (slug === "hero") {
    const hero = await getHeroContent();
    return <HeroEditor label={label} initialContent={hero} />;
  }
  if (slug === "trust-strip") {
    const trust = await getTrustContent();
    return <TrustStripEditor label={label} initialContent={trust} />;
  }
  if (slug === "categories") {
    return <CategoryEditor label={label} />;
  }
  if (slug === "viral-books") {
    const viral = await getViralShelfContent();
    return <ViralBooksEditor label={label} initialContent={viral} />;
  }
  if (slug === "up-sale") {
    const upSale = await getUpSaleShelfContent();
    return (
      <ViralBooksEditor
        label={label}
        initialContent={upSale}
        variant="up-sale"
      />
    );
  }
  if (slug === "new-arrivals") {
    const newArrivals = await getNewArrivalsShelfContent();
    return (
      <ViralBooksEditor
        label={label}
        initialContent={newArrivals}
        variant="new-arrivals"
      />
    );
  }

  if (slug === "trending") {
    const trending = await getTrendingShelfContent();
    return (
      <ViralBooksEditor
        label={label}
        initialContent={trending}
        variant="trending"
      />
    );
  }
  if (slug === "sunnah") {
    const sunnah = await getSunnahShelfContent();
    return (
      <ViralBooksEditor
        label={label}
        initialContent={sunnah}
        variant="sunnah"
      />
    );
  }

  const extraShelves: Record<string, ShelfConfig> = {
    international: {
      slug: "international",
      tag: "international",
      href: "/international-books",
      shelfName: "International Books",
    },
    "student-books": {
      slug: "student-books",
      tag: "student",
      href: "/student-books",
      shelfName: "Student Books",
    },
  };
  if (extraShelves[slug]) {
    return <ShelfEditor label={label} config={extraShelves[slug]} />;
  }
  if (slug === "sell-used-books") {
    return <SellUsedBooksEditor label={label} />;
  }
  if (slug === "used-books") {
    return <UsedBooksEditor label={label} />;
  }
  if (slug === "free-order-wholesale") {
    return <WholesaleEditor label={label} />;
  }
  if (slug === "audio") {
    return <AudioEditor label={label} />;
  }
  if (slug === "authors") {
    return <AuthorsEditor label={label} />;
  }
  if (slug === "publishers") {
    return <PublishersEditor label={label} />;
  }
  if (slug === "reviews") {
    return <ReviewsEditor label={label} />;
  }
  if (slug === "video-quiz") {
    return <VideoQuizEditor label={label} />;
  }
  if (slug === "stories") {
    return <StoriesEditor label={label} />;
  }

  return (
    <SectionEditor slug={slug} label={label} defaults={sectionDefaults[slug]} />
  );
}

export default function SectionEditorPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<EditorSkeleton />}>
      <EditorLoader params={params} />
    </Suspense>
  );
}
