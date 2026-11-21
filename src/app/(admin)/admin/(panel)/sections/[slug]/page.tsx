// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { AdminAudioManager } from "@/components/admin/AdminAudioManager";
import { AuthorsEditor } from "@/components/admin/AuthorsEditor";
import { PublishersEditor } from "@/components/admin/PublishersEditor";
import { ReviewsEditor } from "@/components/admin/ReviewsEditor";
import { AdminStoriesManager } from "@/components/admin/AdminStoriesManager";
import { AdminVideoQuizManager } from "@/components/admin/AdminVideoQuizManager";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
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
import { getVideoQuizCopy } from "@/lib/db/queries/video-quiz";
import { getStoryCopy } from "@/lib/db/queries/stories";
import {
  getInternationalShelfContent,
  getNewArrivalsShelfContent,
  getStudentShelfContent,
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

  if (slug === "international") {
    const international = await getInternationalShelfContent();
    return (
      <ViralBooksEditor
        label={label}
        initialContent={international}
        variant="international"
      />
    );
  }

  if (slug === "student-books") {
    const student = await getStudentShelfContent();
    return (
      <ViralBooksEditor
        label={label}
        initialContent={student}
        variant="student"
      />
    );
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
    return <AdminAudioManager label={label} />;
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
    const copy = await getVideoQuizCopy();
    return <AdminVideoQuizManager label={label} initialCopy={copy} />;
  }
  if (slug === "stories") {
    const copy = await getStoryCopy();
    return <AdminStoriesManager label={label} initialCopy={copy} />;
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
