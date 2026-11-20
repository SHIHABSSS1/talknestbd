import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";
import { getStudentShelfContent } from "@/lib/db/queries/shelves";

export const metadata: Metadata = {
  title: "Student Books",
  description: "Study guides, reference books and skill-builders for exams and beyond.",
};

export default async function StudentBooksPage() {
  const content = await getStudentShelfContent();
  return (
    <ShelfPageContent
      slug="student-books"
      tag="student"
      crumb="Student Books"
      content={content}
    />
  );
}
