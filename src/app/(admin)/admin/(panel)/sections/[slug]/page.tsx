import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { CategoryEditor } from "@/components/admin/CategoryEditor";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { ShelfEditor, type ShelfConfig } from "@/components/admin/ShelfEditor";
import { TrustStripEditor } from "@/components/admin/TrustStripEditor";
import { UsedBooksEditor } from "@/components/admin/UsedBooksEditor";
import { SectionEditor } from "@/components/admin/SectionEditor";
import { SellUsedBooksEditor } from "@/components/admin/SellUsedBooksEditor";
import { sectionDefaults, isKnownSection } from "@/lib/section-content";
import { findAdminNavItem } from "@/lib/admin-nav";

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
    return <HeroEditor label={label} />;
  }
  if (slug === "trust-strip") {
    return <TrustStripEditor label={label} />;
  }
  if (slug === "categories") {
    return <CategoryEditor label={label} />;
  }
  const viralShelf: ShelfConfig = {
    slug: "viral-books",
    tag: "viral",
    href: "/viral-books",
    shelfName: "Viral Books",
  };
  if (slug === "viral-books") {
    return <ShelfEditor label={label} config={viralShelf} />;
  }
  const upSaleShelf: ShelfConfig = {
    slug: "up-sale",
    tag: "up-sale",
    href: "/up-sales",
    shelfName: "50% Up Sale",
  };
  if (slug === "up-sale") {
    return <ShelfEditor label={label} config={upSaleShelf} />;
  }
  if (slug === "sell-used-books") {
    return <SellUsedBooksEditor label={label} />;
  }
  if (slug === "used-books") {
    return <UsedBooksEditor label={label} />;
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
