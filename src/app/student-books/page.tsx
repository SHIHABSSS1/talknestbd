import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "স্টুডেন্ট বুকস",
  description: "HSC, SSC ও প্রতিযোগিতামূলক পরীক্ষার প্রস্তুতির জন্য নির্বাচিত বই।",
};

export default function StudentBooksPage() {
  return <CollectionPage collection="student" />;
}
