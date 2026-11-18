"use client";

import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { usePublisherContent } from "@/components/providers/PublisherContentProvider";
import { useBookContent } from "@/components/providers/BookContentProvider";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { toBn } from "@/lib/utils";

export function PublishersPageContent() {
  const { content } = usePublisherContent();
  const { books } = useBookContent();
  const { listing, publishers } = content;

  return (
    <>
      <PageHeader
        eyebrow={listing.eyebrow}
        title={listing.title}
        description={listing.description}
        crumbs={[{ label: "Publishers" }]}
      />

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publishers.map((publisher) => {
              const publisherBooks = books.filter((book) => book.publisherSlug === publisher.slug);
              return (
                <Link
                  key={publisher.slug}
                  href={`/publishers/${publisher.slug}`}
                  className="group relative overflow-hidden rounded-2xl border border-line bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-shadow"
                >
                  <div className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-forest-900/8" />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid h-12 w-12 place-items-center overflow-hidden rounded-lg text-sm font-bold text-white"
                      style={{ backgroundColor: publisher.accent }}
                    >
                      {publisher.imageSrc ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={publisher.imageSrc} alt="" className="h-full w-full object-cover" />
                      ) : (
                        publisher.initials
                      )}
                    </span>
                    <ArrowUpRight size={17} className="text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600" />
                  </div>
                  <h2 className="mt-4 text-lg font-bold text-forest-950">{publisher.name}</h2>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: publisher.accent }}>{publisher.tagline}</p>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">{publisher.description}</p>
                  <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-line pt-3 text-[10px] text-muted">
                    <span className="inline-flex items-center gap-1"><Building2 size={11} /> Est. {publisher.established}</span>
                    <span className="inline-flex items-center gap-1"><MapPin size={11} /> {publisher.location}</span>
                    <span className="font-semibold text-brand-700">{toBn(publisherBooks.length)} books</span>
                  </div>
                </Link>
              );
            })}
          </div>

          <section className="mt-8 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-forest-950 px-6 py-6 text-cream-50">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.14em] text-gold-300">{listing.ctaLabel}</p>
              <h2 className="mt-1 font-display text-xl font-bold">{listing.ctaTitle}</h2>
              <p className="mt-1 text-[11px] text-cream-100/60">{listing.ctaDescription}</p>
            </div>
            <Button href="/wholesale" variant="gold" size="sm">{listing.ctaLinkLabel}</Button>
          </section>
        </Container>
      </section>
    </>
  );
}
