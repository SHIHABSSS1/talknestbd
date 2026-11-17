import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AudioLibrary } from "@/components/audio/AudioLibrary";

export const metadata: Metadata = {
  title: "Audiobooks",
  description:
    "The TalkNest BD audiobook library — free titles, free first-chapter previews and premium books you can unlock once and keep.",
};

export default function AudioBooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Audio"
        title="Let your eyes rest, listen to the story"
        description="Two audiobooks are completely free. Every premium audiobook includes a free first-chapter preview — unlock the title to listen all the way through."
        tone="dark"
        crumbs={[{ label: "Audiobooks" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            2 completely free
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            Free first-chapter preview
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            Buy once, listen forever
          </span>
        </div>
      </PageHeader>
      <section className="py-8 sm:py-10">
        <Container>
          <AudioLibrary />
        </Container>
      </section>
    </>
  );
}
