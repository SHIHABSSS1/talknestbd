import type { Metadata } from "next";
import { Suspense } from "react";
import { categories, getCategory } from "@/data/categories";
import { CategoryDetail } from "@/components/categories/CategoryDetail";

export function generateStaticParams() {
  return categories.map((category) => ({ slug: category.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) return { title: "Category" };
  return {
    title: category.name,
    description: category.description,
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
