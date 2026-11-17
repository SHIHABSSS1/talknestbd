import type { Metadata } from "next";
import { Mic } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { StoryShareForm } from "@/components/stories/StoryShareForm";

export const metadata: Metadata = {
  title: "Share Your Story",
  description:
    "Share your story in TalkNest's Share to My Heart section — write it, record a voice note or upload a PDF diary.",
};

export default function StorySharePage() {
  return (
    <>
      <PageHeader
        eyebrow="Share to My Heart"
        title="Tell us your story"
        description="Written, recorded or uploaded — however you want to tell it, send your story our way. Our editorial team will review it and share it with the reader community."
        crumbs={[{ label: "Reader Stories", href: "/stories" }, { label: "Share a Story" }]}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
          <Mic size={12} /> Voice · Written · PDF
        </span>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container className="max-w-5xl">
          <StoryShareForm />
        </Container>
      </section>
    </>
  );
}
