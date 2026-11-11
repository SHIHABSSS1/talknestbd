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
import { toBn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

const typeMeta = {
  voice: { label: "ভয়েস স্টোরি", icon: Mic },
  text: { label: "লেখা", icon: PenLine },
  pdf: { label: "PDF", icon: FileText },
};

export function StoryCommunity() {
  return (
    <section className="bg-cream-100/70 py-10 sm:py-14">
      <Container>
        <div className="grid gap-8 lg:grid-cols-[0.88fr_1.42fr] lg:gap-10">
          <div className="lg:sticky lg:top-36 lg:self-start">
            <SectionHeader
              eyebrow="Share to My Heart"
              title="আপনার গল্প, সবার হৃদয়ে"
              description="জীবনের ছোট ছোট গল্প, স্মৃতি আর অনুভূতি শেয়ার করুন — লিখে, ভয়েস রেকর্ড করে বা PDF আপলোড করে।"
              className="mb-4"
            />

            <div className="space-y-2.5">
              {[
                { icon: Mic, text: "নিজের কণ্ঠে গল্প রেকর্ড করুন" },
                { icon: PenLine, text: "লিখে শেয়ার করুন আপনার স্মৃতি" },
                { icon: FileText, text: "PDF ডায়েরি বা লেখা আপলোড করুন" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.text} className="flex items-center gap-3 text-xs text-forest-800/75">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-forest-100 text-forest-700">
                      <Icon size={14} />
                    </span>
                    {item.text}
                  </div>
                );
              })}
            </div>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/stories/share" variant="primary">
                <Mic size={16} />
                গল্প শেয়ার করুন
              </Button>
              <Button href="/stories" variant="outline">
                সব গল্প পড়ুন
              </Button>
            </div>

            <div className="mt-6 flex items-center gap-2 rounded-xl border border-clay-500/15 bg-clay-500/5 px-3.5 py-3 text-[10px] leading-relaxed text-clay-600">
              <Heart size={14} className="shrink-0 fill-clay-500/20 text-clay-500" />
              পাঠকদের ভালোবাসায় এ মাসে ২১০+ গল্প শেয়ার হয়েছে।
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {stories.slice(0, 4).map((story) => {
              const meta = typeMeta[story.type];
              const Icon = meta.icon;
              return (
                <article
                  key={story.id}
                  className="flex flex-col rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5"
                >
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-100 px-2.5 py-1 text-[9px] font-semibold text-forest-800">
                      <Icon size={11} />
                      {meta.label}
                      {story.duration && ` · ${story.duration}`}
                    </span>
                    <span className="text-[9px] text-muted">{story.date}</span>
                  </div>
                  <h3 className="mt-3 font-display text-base font-semibold leading-snug text-forest-950">
                    {story.title}
                  </h3>
                  <p className="mt-1.5 line-clamp-3 flex-1 text-[11px] leading-relaxed text-muted sm:text-xs">
                    {story.excerpt}
                  </p>
                  <div className="mt-4 flex items-center justify-between border-t border-forest-900/8 pt-3">
                    <span className="flex items-center gap-2">
                      <span
                        className="grid h-7 w-7 place-items-center rounded-full text-[9px] font-bold text-cream-50"
                        style={{ backgroundColor: story.avatarColor }}
                      >
                        {story.name.charAt(0)}
                      </span>
                      <span className="text-[10px] font-medium text-forest-900">
                        {story.name}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-[9px] text-muted">
                      <ThumbsUp size={11} />
                      {toBn(story.likes)}
                    </span>
                  </div>
                </article>
              );
            })}
            <Link
              href="/stories"
              className="flex items-center justify-center gap-2 rounded-2xl border border-dashed border-forest-900/20 px-4 py-5 text-xs font-semibold text-forest-800 transition-colors hover:border-forest-900/40 hover:bg-cream-100 sm:col-span-2"
            >
              আরও গল্প পড়ুন
              <ArrowUpRight size={14} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
