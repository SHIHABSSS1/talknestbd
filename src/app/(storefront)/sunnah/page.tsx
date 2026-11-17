import type { Metadata } from "next";
import { ShelfPageContent } from "@/components/books/ShelfPageContent";

export const metadata: Metadata = {
  title: "Sunnah Essentials",
  description: "A considered collection of books for daily Sunnah practice.",
};

export default function SunnahPage() {
  return <ShelfPageContent slug="sunnah" tag="sunnah" crumb="Sunnah Essentials" />;
}
