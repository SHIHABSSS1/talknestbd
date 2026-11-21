import type { Metadata } from "next";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { VideoDetailContent } from "@/components/video/VideoDetailContent";
import { getPublishedVideos, getVideoBySlug } from "@/lib/db/queries/video-quiz";

export const instant = false;

export async function generateStaticParams() {
  const videos = await getPublishedVideos();
  return videos.map((video) => ({ slug: video.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  "use cache";
  const { slug } = await params;
  const video = await getVideoBySlug(slug);
  if (!video) return { title: "Video" };
  return {
    title: video.title,
    description: video.description || `${video.title} — a TalkNest episode.`,
    openGraph: {
      title: `${video.title} — TalkNest Video`,
      description: video.description || "A TalkNest video episode.",
      type: "article",
      images: video.thumbnail ? [video.thumbnail] : undefined,
    },
  };
}

export default function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  return (
    <Suspense
      fallback={
        <section className="py-16">
          <Container>
            <p className="text-center text-sm text-muted">Loading episode…</p>
          </Container>
        </section>
      }
    >
      <VideoDetailPageContent params={params} />
    </Suspense>
  );
}

async function VideoDetailPageContent({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return <VideoDetailContent slug={slug} />;
}
