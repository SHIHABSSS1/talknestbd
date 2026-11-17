import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "Student Books",
  description: "Selected books for HSC, SSC and competitive exam preparation.",
};

export default function StudentBooksPage() {
  return <CollectionPage collection="student" />;
}
