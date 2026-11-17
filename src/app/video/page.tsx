import type { Metadata } from "next";
import { BookOpen, PlayCircle } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { Button } from "@/components/ui/Button";
import { VideoGallery } from "@/components/video/VideoGallery";

export const metadata: Metadata = {
  title: "TalkNest Podcast & Video",
  description:
    "Author interviews, book reviews, reading lists and conversations — every TalkNest episode in one place, playable through YouTube.",
};

export default function VideoPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Podcast"
        title="Conversations about books, authors and stories"
        description="A new episode every week — author interviews, book reviews, reader stories and quizzes. Click any episode to watch it in the YouTube player."
        tone="dark"
        crumbs={[{ label: "Video" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            New episode every Thursday
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            Plays directly on YouTube
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            Authors and readers in conversation
          </span>
        </div>
      </PageHeader>
      <section className="py-8 sm:py-10">
        <Container>
          <VideoGallery />
        </Container>
      </section>

      <section className="border-t border-line bg-canvas py-8 sm:py-10">
        <Container>
          <div className="flex flex-wrap items-end justify-between gap-5 rounded-[10px] border border-brand-100 bg-brand-50/60 p-5 sm:p-7">
            <SectionTitle
              eyebrow="Quiz section"
              title="Two quizzes, one page."
              description="Watch an episode and take the Watch & Quiz, or jump straight into the Book Quiz and this week's leaderboard. Both live together on the TalkNest Quiz page."
            />
            <div className="flex flex-wrap gap-2">
              <Button href="/quiz?tab=watch">
                <PlayCircle size={14} />
                Watch &amp; Quiz
              </Button>
              <Button href="/quiz?tab=book" variant="outline">
                <BookOpen size={14} />
                Book Quiz
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
