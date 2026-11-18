"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { usePublisherContent } from "@/components/providers/PublisherContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { formatCount } from "@/lib/utils";

export function PublishersStrip() {
  const { content } = usePublisherContent();
  const { books } = useBookContent();
  const presses = content.publishers;

  if (presses.length === 0) return null;

  return (
    <section className="bg-canvas py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={content.section.eyebrow}
          title={content.section.title}
          description={content.section.description}
          href="/publishers"
          linkLabel={content.section.linkLabel}
          className="mb-6 sm:mb-7"
        />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {presses.map((publisher) => {
            const count = books.filter((book) => book.publisherSlug === publisher.slug).length;
            return (
              <Link
                key={publisher.slug}
                href={`/publishers/${publisher.slug}`}
                className="group flex flex-col rounded-[8px] border border-line bg-white p-3.5 transition-colors hover:border-brand-300 sm:p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="grid h-11 w-11 place-items-center overflow-hidden rounded-[4px] text-sm font-bold text-white"
                    style={{ backgroundColor: publisher.accent }}
                  >
                    {publisher.imageSrc ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={publisher.imageSrc} alt="" className="h-full w-full object-cover" />
                    ) : (
                      publisher.initials
                    )}
                  </span>
                  <ArrowUpRight size={14} className="text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                </div>
                <h3 className="mt-3 line-clamp-2 text-[11px] font-semibold text-forest-950">{publisher.name}</h3>
                <p className="mt-1 text-[10px] text-muted">{formatCount(count)} books · Since {publisher.established}</p>
              </Link>
            );
          })}
        </div>

        <ViewAllRow href="/publishers" label={content.section.linkLabel} count={`${presses.length} presses`} />
      </Container>
    </section>
  );
}
