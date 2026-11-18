"use client";

import Link from "next/link";
import { Check, FileText, Mic, PenLine } from "lucide-react";
import { useStories } from "@/components/providers/StoriesProvider";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { Button } from "@/components/ui/Button";

const typeIcons = { voice: Mic, text: PenLine, pdf: FileText };

export function StoryCommunity() {
  const { content } = useStories();
  const shown = content.stories.slice(0, 4);

  if (shown.length === 0) return null;

  return (
    <section className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={content.section.eyebrow}
          title={content.section.title}
          description={content.section.description}
          href="/stories"
          linkLabel={content.section.linkLabel}
          className="mb-5"
        />

        <div className="mb-5 grid gap-4 rounded-[10px] border border-line bg-cream-50 p-5 lg:grid-cols-[1fr_auto] lg:items-center">
          <ul className="grid gap-2 sm:grid-cols-3">
            {content.home.bullets.map((bullet, index) => (
              <li key={index} className="flex items-center gap-2 text-[11px] font-medium text-forest-800">
                <Check size={13} className="shrink-0 text-brand-600" aria-hidden="true" />
                {bullet}
              </li>
            ))}
          </ul>
          <div className="flex flex-wrap gap-2">
            <Button href="/stories/share" variant="primary" size="sm">
              <Mic size={13} aria-hidden="true" /> {content.home.primaryLabel}
            </Button>
            <Button href="/stories" variant="outline" size="sm">
              {content.home.secondaryLabel}
            </Button>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {shown.map((story) => {
            const Icon = typeIcons[story.type];
            return (
              <article key={story.id} className="flex flex-col rounded-[10px] border border-line bg-white p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-brand-50 px-2 py-1 text-[9px] font-semibold text-brand-700">
                    <Icon size={10} aria-hidden="true" /> {story.type === "voice" ? "Voice" : story.type === "pdf" ? "PDF" : "Written"}
                  </span>
                  <span className="text-[9px] text-muted">{story.date}</span>
                </div>
                <h3 className="mt-3 font-display text-[13px] font-bold leading-snug text-ink">{story.title}</h3>
                <p className="mt-1 line-clamp-2 flex-1 text-[10px] leading-relaxed text-muted">{story.excerpt}</p>
                <div className="mt-3 flex items-center gap-2 border-t border-line pt-3">
                  <span className="grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold text-white" style={{ backgroundColor: story.avatarColor }}>
                    {story.name.charAt(0)}
                  </span>
                  <span className="min-w-0 flex-1 truncate text-[10px] font-semibold text-ink">{story.name}</span>
                  <span className="text-[9px] tabular-nums text-muted">{formatCount(story.likes)}</span>
                </div>
              </article>
            );
          })}
          <Link
            href="/stories"
            className="flex min-h-[160px] items-center justify-center rounded-[10px] border border-dashed border-brand-200 bg-brand-50/40 p-4 text-center text-[11px] font-semibold text-brand-700 transition-colors hover:bg-brand-50"
          >
            Read more reader stories
          </Link>
        </div>

        <p className="mt-4 text-center text-[10px] text-muted">{content.home.notice}</p>
        <ViewAllRow href="/stories" label={content.section.linkLabel} count={`${content.stories.length} stories`} />
      </Container>
    </section>
  );
}
