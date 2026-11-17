"use client";

import Link from "next/link";
import { ArrowRight, ArrowUpRight, Recycle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";
import { useUsedContent } from "@/components/providers/UsedContentProvider";

export function UsedBooksBanner() {
  const { content } = useUsedContent();

  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="grid overflow-hidden rounded-[8px] border border-line bg-white lg:grid-cols-2">
          <div className="relative min-h-[240px] overflow-hidden lg:min-h-[340px]">
            {content.imageSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={content.imageSrc}
                alt={content.imageAlt}
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
            ) : (
              <div className="absolute inset-0 bg-brand-100" />
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/35 to-transparent" />
            <div className="absolute left-4 top-4 rounded-[4px] bg-brand-900 px-3.5 py-2.5 text-white sm:left-6 sm:top-6">
              <p className="text-2xl font-bold leading-none text-sale sm:text-3xl">
                {content.badgeValue}
              </p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/70">
                {content.badgeLabel}
              </p>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium text-brand-900 backdrop-blur sm:bottom-6 sm:left-6">
              <Recycle size={12} className="text-brand-600" />
              {content.chip}
            </div>
          </div>

          <div className="relative p-5 sm:p-8 lg:p-10">
            <SectionTitle
              size="lg"
              eyebrow={content.eyebrow}
              title={
                <>
                  {content.titlePrefix}
                  <span className="text-brand-600">{content.titleHighlight}</span>
                </>
              }
              description={content.description}
            />

            <div className="mt-4 flex flex-wrap gap-2">
              <Button href="/up-sales" variant="primary">
                Buy used books
                <ArrowRight size={15} />
              </Button>
              <Button href="/sell-used-books" variant="outline">
                Sell used books
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-body">
              {content.features.map((item, index) => (
                <span key={index} className="flex items-center gap-1.5">
                  <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                  {item}
                </span>
              ))}
            </div>

            <Link
              href="/sell-used-books"
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-700 transition-colors hover:text-brand-800"
            >
              How it works
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
