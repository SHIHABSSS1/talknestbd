"use client";

import { Check, Mic } from "lucide-react";

import { useStories } from "@/components/providers/StoriesProvider";
import { StoryCard } from "@/components/stories/StoryCard";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { Button } from "@/components/ui/Button";

export function StoryCommunity() {
  const { copy, stories, total, loading } = useStories();
  const shown = stories.slice(0, 4);

  if (!loading && shown.length === 0) return null;

  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={copy.section.eyebrow}
          title={copy.section.title}
          description={copy.section.description}
          href="/stories"
          linkLabel={copy.section.linkLabel}
          className="mb-5"
        />

        <div className="mb-5 grid gap-4 rounded-[10px] border border-line bg-cream-50 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <ul className="grid gap-2 sm:grid-cols-3">
            {copy.home.bullets.map((bullet, index) => (
              <li key={index} className="flex items-center gap-2 text-[11px] font-medium text-forest-800">
                <Check size={13} className="shrink-0 text-brand-600" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button href="/stories/share" variant="primary" size="sm">
              <Mic size={13} aria-hidden="true" /> {copy.home.primaryLabel}
            </Button>
            <Button href="/stories" variant="outline" size="sm">
              {copy.home.secondaryLabel}
            </Button>
          </div>
        </div>

        {loading ? (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-hidden="true">
            {[0, 1, 2, 3].map((item) => (
              <div key={item} className="h-72 animate-pulse rounded-[10px] bg-cream-100" />
            ))}
          </div>
        ) : (
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {shown.map((story) => (
              <StoryCard key={story.id} story={story} compact />
            ))}
          </div>
        )}

        <p className="mt-4 text-center text-[10px] text-muted">{copy.home.notice}</p>
        <ViewAllRow href="/stories" label={copy.section.linkLabel} count={`${total} stories`} />
      </Container>
    </section>
  );
}
