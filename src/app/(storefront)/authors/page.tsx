import type { Metadata } from "next";
import { AuthorsPageContent } from "@/components/authors/AuthorsPageContent";

export const metadata: Metadata = {
  title: "Authors",
  description: "Meet the writers, thinkers and storytellers shaping what Bangladesh reads.",
};

export default function AuthorsPage() {
  return <AuthorsPageContent />;
}
