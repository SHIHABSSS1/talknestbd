import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { CategoryCards } from "@/components/categories/CategoryCards";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse novels, literature, Islamic history, biographies, student books and international titles.",
};

export default function CategoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Browse by Genre"
        title="Choose a category for your mood"
        description="Every category brings together reader-approved books, simple filters and fresh voices."
        crumbs={[{ label: "Categories" }]}
      />
      <CategoryCards />
    </>
  );
}
