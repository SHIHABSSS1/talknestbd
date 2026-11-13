import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publishers } from "@/data/publishers";
import { books } from "@/data/books";
import { formatCount } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";

export function PublishersStrip() {
  return (
    <section className="bg-canvas py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow="Our publishers"
          title="Independent voices, trusted presses"
          description="Explore hand-picked titles from publishers known for careful editing and lasting books."
          href="/publishers"
          linkLabel="All publishers"
          className="mb-6 sm:mb-7"
        />

        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 sm:gap-3 lg:grid-cols-6">
          {publishers.map((publisher) => {
            const count = books.filter(
              (book) => book.publisherSlug === publisher.slug,
            ).length;
            return (
              <Link
                key={publisher.slug}
                href={`/publishers/${publisher.slug}`}
                className="group flex flex-col rounded-[8px] border border-line bg-white p-3.5 transition-colors hover:border-brand-300 sm:p-4"
              >
                <div className="flex items-start justify-between gap-2">
                  <span
                    className="grid h-11 w-11 place-items-center rounded-[4px] text-sm font-bold text-white"
                    style={{ backgroundColor: publisher.accent }}
                  >
                    {publisher.initials}
                  </span>
                  <ArrowUpRight
                    size={14}
                    className="text-muted/50 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </div>
                <h3 className="mt-3 line-clamp-2 min-h-9 text-[12px] font-medium leading-snug text-ink transition-colors group-hover:text-brand-700">
                  {publisher.name}
                </h3>
                <p className="mt-1 text-[10px] text-muted">
                  {formatCount(count)} books · Since {publisher.established}
                </p>
              </Link>
            );
          })}
        </div>

        <ViewAllRow
          href="/publishers"
          label="All publishers"
          count={`${publishers.length} presses`}
        />
      </Container>
    </section>
  );
}
