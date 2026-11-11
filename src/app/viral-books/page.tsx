import type { Metadata } from "next";
import { CollectionPage } from "@/components/books/CollectionPage";

export const metadata: Metadata = {
  title: "ভাইরাল বই",
  description: "সোশ্যাল মিডিয়ায় পাঠকদের মুখে মুখে ছড়িয়ে পড়া জনপ্রিয় বই।",
};

export default function ViralBooksPage() {
  return <CollectionPage collection="viral" />;
}
