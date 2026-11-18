"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useStories } from "@/components/providers/StoriesProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { StoryShareForm } from "@/components/stories/StoryShareForm";

export function SharePageContent() {
  const { content } = useStories();
  const page = content.share;

  return (
    <>
      <PageHeader
        eyebrow={page.eyebrow}
        title={page.title}
        description={page.description}
        crumbs={[{ label: "Reader Stories", href: "/stories" }, { label: "Share a Story" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            {page.badge}
          </span>
          <Link
            href="/stories"
            className="inline-flex items-center gap-1.5 rounded-full border border-white/15 px-3 py-1.5 text-[10px] text-cream-100/80 hover:bg-white/10"
          >
            <ArrowLeft size={11} aria-hidden="true" /> Back to stories
          </Link>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container className="max-w-5xl">
          <StoryShareForm />
        </Container>
      </section>
    </>
  );
}
