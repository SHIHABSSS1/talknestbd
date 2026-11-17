import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";

export const metadata: Metadata = {
  title: "Student Books",
  description: "Study guides, reference books and skill-builders for exams and beyond.",
};

export default function StudentBooksPage() {
  return (
    <ShelfPageContent slug="student-books" tag="student" crumb="Student Books" />
  );
}
