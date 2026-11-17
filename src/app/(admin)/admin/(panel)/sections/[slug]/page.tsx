import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { HeroEditor } from "@/components/admin/HeroEditor";
import { SectionEditor } from "@/components/admin/SectionEditor";
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

  // The hero is an image carousel, so it needs its own banner editor.
  if (slug === "hero") {
    return <HeroEditor label={label} />;
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
