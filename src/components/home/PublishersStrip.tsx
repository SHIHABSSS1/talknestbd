import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { publishers } from "@/data/publishers";
import { books } from "@/data/books";
import { toBn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";

export function PublishersStrip() {
  return (
    <section className="bg-cream-100/70 py-10 sm:py-14">
      <Container>
        <SectionHeader
          eyebrow="প্রকাশনী"
          title="দেশের প্রিয় প্রকাশনীর বই"
          description="বিশ্বস্ত প্রকাশনীর বাছাই করা বই, এক জায়গায়।"
          href="/publishers"
          linkLabel="সব প্রকাশনী"
        />

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {publishers.map((publisher) => {
            const count = books.filter(
              (book) => book.publisherSlug === publisher.slug,
            ).length;
            return (
              <Link
                key={publisher.slug}
                href={`/publishers/${publisher.slug}`}
                className="group flex flex-col items-center rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-6 text-center transition-all duration-300 hover:-translate-y-1 hover:border-forest-900/15 hover:shadow-[0_20px_40px_-32px_rgba(10,33,24,0.5)]"
              >
                <span
                  className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-bold text-cream-50 shadow-sm transition-transform duration-300 group-hover:rotate-3"
                  style={{ backgroundColor: publisher.accent }}
                >
                  {publisher.initials}
                </span>
                <h3 className="mt-3 line-clamp-2 min-h-10 font-display text-[13px] font-semibold leading-snug text-forest-950">
                  {publisher.name}
                </h3>
                <p className="mt-1 text-[10px] text-muted">
                  {toBn(count)}টি বই · {publisher.established}
                </p>
                <ArrowUpRight
                  size={14}
                  className="mt-3 text-forest-700/35 transition-all group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay-500"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
