import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { categories, getCategory } from "@/data/categories";
import { getBooksByCategory } from "@/data/books";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { cn } from "@/lib/utils";

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
  if (!category) return { title: "ক্যাটাগরি" };
  return {
    title: category.name,
    description: category.description,
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const category = getCategory(slug);
  if (!category) notFound();
  const categoryBooks = getBooksByCategory(category.slug);

  return (
    <>
      <PageHeader
        eyebrow={category.englishName}
        title={category.name}
        description={category.description}
        crumbs={[{ label: "ক্যাটাগরি", href: "/categories" }, { label: category.name }]}
      >
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {categories.map((item) => (
            <Link
              key={item.slug}
              href={`/category/${item.slug}`}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-[11px] font-medium transition-colors",
                item.slug === category.slug
                  ? "border-forest-900 bg-forest-900 text-cream-50"
                  : "border-forest-900/10 bg-cream-50 text-forest-800 hover:border-forest-900/30",
              )}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </PageHeader>
      <section className="py-8 sm:py-12">
        <Container>
          <p className="mb-6 text-xs text-muted">
            {categoryBooks.length}টি বই পাওয়া গেছে
          </p>
          {categoryBooks.length > 0 ? (
            <BookGrid books={categoryBooks} columns="five" />
          ) : (
            <p className="rounded-2xl bg-cream-100 p-8 text-center text-sm text-muted">
              এই ক্যাটাগরিতে খুব শিগগিরই নতুন বই যোগ হবে।
            </p>
          )}
        </Container>
      </section>
    </>
  );
}
