import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { StoryDetailContent } from "@/components/stories/StoryDetailContent";
import { getPublishedStoryBySlug, listStories } from "@/lib/db/queries/stories";

export const instant = false;

export async function generateStaticParams() {
  const data = await listStories({ status: "published", limit: 100, offset: 0 });
  return data.rows.map((story) => ({ slug: story.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const story = await getPublishedStoryBySlug(slug);
  if (!story) return { title: "Reader Story" };
  return {
    title: `${story.title} — Reader Story`,
    description: story.excerpt,
    openGraph: {
      title: `${story.title} — TalkNest Reader Stories`,
      description: story.excerpt,
      type: "article",
      images: story.coverUrl ? [story.coverUrl] : undefined,
    },
  };
}

export default function StoryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container>
            <p className="text-center text-sm text-muted">Loading story…</p>
          </Container>
        </section>
      }
    >
      <StoryDetailPageContent params={params} />
    </Suspense>
  );
}

async function StoryDetailPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <StoryDetailContent slug={slug} />;
}
