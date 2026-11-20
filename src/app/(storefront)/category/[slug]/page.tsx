import type { Metadata } from "next";
import { Suspense } from "react";
import { CategoryDetail } from "@/components/categories/CategoryDetail";
import { getCategoryContent } from "@/lib/db/queries/categories";

/**
 * Routes come from the database-backed category document, not the legacy
 * static catalogue, so a shelf created in /admin/sections/categories gets a
 * prerendered route on the next build (and is still rendered on demand before
 * then — dynamic params remain enabled).
 */
export async function generateStaticParams() {
  const content = await getCategoryContent();
  return content.tiles
    .filter((tile) => !tile.audio)
    .map((tile) => ({ slug: tile.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const content = await getCategoryContent();
  const tile = content.tiles.find((item) => item.slug === slug);
  if (!tile) return { title: "Category" };
  return {
    title: tile.name,
    description: tile.description,
  };
}

async function CategoryLoader({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <CategoryDetail slug={slug} />;
}

export default function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <p className="text-center text-sm text-muted">Loading category…</p>
        </section>
      }
    >
      <CategoryLoader params={params} />
    </Suspense>
  );
}
