"use client";

import { useAudioContent } from "@/components/providers/AudioContentProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AudioLibrary } from "@/components/audio/AudioLibrary";

export function AudioPageContent() {
  const { content } = useAudioContent();
  const { library } = content;

  return (
    <>
      <PageHeader
        eyebrow={library.eyebrow}
        title={library.title}
        description={library.description}
        tone="dark"
        crumbs={[{ label: "Audiobooks" }]}
      >
        <div className="flex flex-wrap gap-2">
          {library.badges.map((badge, index) => (
            <span
              key={index}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-cream-100/80"
            >
              {badge}
            </span>
          ))}
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
