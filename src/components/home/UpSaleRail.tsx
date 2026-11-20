"use client";

import Link from "next/link";
import { ArrowRight, BadgePercent } from "lucide-react";
import { formatPrice } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { UpSaleGrid } from "@/components/books/UpSaleGrid";
import { toUpSaleBook } from "@/components/providers/UpSaleBooksProvider";
import type { ViralShelfContent } from "@/lib/shelf-content";

/** The 50% up-sale rail, driven by the DB-backed `shelf:up-sale` document. */
export function UpSaleRail({ content }: { content: ViralShelfContent }) {
  const heading = content.heading;
  const books = content.books.map(toUpSaleBook);
  const example = books[0];

  if (books.length === 0) return null;

  return (
    <section id="up-sale" className="border-b border-line bg-white py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow={heading.eyebrow}
          title={heading.title}
          description={heading.description}
          href="/up-sales"
          linkLabel={heading.linkLabel}
          className="mb-5 sm:mb-6"
        />

        {example && (
          <div className="mb-4 flex flex-wrap items-center gap-x-2.5 gap-y-1.5 rounded-[8px] border border-line bg-canvas px-3 py-2.5 text-[10.5px] text-body sm:mb-5 sm:text-[11.5px]">
            <span className="inline-flex items-center gap-1 rounded-[3px] bg-sale px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-[0.08em] text-ink">
              <BadgePercent size={10} />
              How the price works
            </span>
            <span>
              New <b className="text-ink">{formatPrice(example.originalPrice)}</b>
            </span>
            <ArrowRight size={11} className="text-muted" aria-hidden="true" />
            <span>
              Reader gets 50% <b className="text-ink">{formatPrice(example.sellingPrice)}</b>
            </span>
            <ArrowRight size={11} className="text-muted" aria-hidden="true" />
            <span>
              +50% up <b className="text-ink">{formatPrice(example.price)}</b>
            </span>
            <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[9.5px] font-semibold text-brand-700">
              Next reader saves {formatPrice(example.originalPrice - example.price)}
            </span>
            <Link
              href="/sell-used-books"
              className="ml-auto inline-flex items-center gap-1 text-[10px] font-semibold text-brand-700 hover:text-brand-800"
            >
              See how selling works
              <ArrowRight size={11} />
            </Link>
          </div>
        )}

        <UpSaleGrid books={books} variant="rail" />

        <ViewAllRow
          href="/up-sales"
          label="See all 50% up books"
          count={`${books.length} copies`}
        />
      </Container>
    </section>
  );
}
