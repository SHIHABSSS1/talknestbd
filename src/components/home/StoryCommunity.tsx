import Link from "next/link";
import {
  ArrowUpRight,
  FileText,
  Heart,
  Mic,
  PenLine,
  ThumbsUp,
} from "lucide-react";
import { stories } from "@/data/community";
import { formatCount } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const typeMeta = {
  voice: { label: "Voice story", icon: Mic },
  text: { label: "Written story", icon: PenLine },
  pdf: { label: "PDF story", icon: FileText },
};

export function StoryCommunity() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="grid gap-7 lg:grid-cols-[0.88fr_1.42fr] lg:gap-10">
          <div className="lg:sticky lg:top-[88px] lg:self-start">
            <SectionHeader
              eyebrow="Reader stories"
              title="Your story belongs here"
              description="Share a memory, a turning point or a small everyday joy — write it, record it in your voice or upload a PDF diary."
              href="/stories"
              linkLabel="All stories"
              className="mb-4"
            />

            <div className="space-y-2">
              {[
                { icon: Mic, text: "Record a story in your own voice" },
                { icon: PenLine, text: "Write and share a memory" },
                { icon: FileText, text: "Upload a PDF diary or letter" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.text}
                    className="flex items-center gap-2.5 text-[12px] text-body"
                  >
                    <span className="grid h-7 w-7 place-items-center rounded-[4px] bg-brand-50 text-brand-600">
                      <Icon size={13} />
                    </span>
                    {item.text}
                  </div>
                );
              })}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button href="/stories/share" variant="primary">
                <Mic size={15} />
                Share your story
              </Button>
              <Button href="/stories" variant="outline">
                Read all stories
              </Button>
            </div>

            <div className="mt-4 flex items-center gap-2 rounded-[4px] border border-[#ffd08a] bg-[#fff5e6] px-3 py-2.5 text-[10px] leading-relaxed text-body">
              <Heart size={13} className="shrink-0 fill-sale/20 text-sale" />
              More than 210 stories shared by readers this month.
            </div>
          </div>

          <div className="grid gap-2.5 sm:grid-cols-2 sm:gap-3">
            {stories.slice(0, 4).map((story) => {
              const meta = typeMeta[story.type];
              const Icon = meta.icon;
              return (
                <article
                  key={story.id}
                  className="flex flex-col rounded-[8px] border border-line bg-white p-4"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-brand-50 px-2 py-1 text-[9px] font-medium text-brand-700">
                      <Icon size={10} />
                      {meta.label}
                      {story.duration && ` · ${story.duration}`}
                    </span>
                    <span className="text-[9px] text-muted">{story.date}</span>
                  </div>
                  <h3 className="mt-2.5 text-[14px] font-medium leading-snug text-ink">
                    {story.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-muted sm:text-xs">
                    {story.excerpt}
                  </p>
                  <div className="mt-3.5 flex items-center justify-between border-t border-line pt-3">
                    <span className="flex items-center gap-2">
                      <span
                        className="grid h-6 w-6 place-items-center rounded-full text-[9px] font-bold text-white"
                        style={{ backgroundColor: story.avatarColor }}
                      >
                        {story.name.charAt(0)}
                      </span>
                      <span className="text-[10px] font-medium text-body">
                        {story.name}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-muted">
                      <ThumbsUp size={10} />
                      {formatCount(story.likes)}
                    </span>
                  </div>
                </article>
              );
            })}
            <Link
              href="/stories"
              className="flex items-center justify-center gap-2 rounded-[8px] border border-dashed border-brand-200 px-4 py-4 text-[12px] font-medium text-brand-700 transition-colors hover:border-brand-400 hover:bg-brand-50 sm:col-span-2"
            >
              Read more reader stories
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
