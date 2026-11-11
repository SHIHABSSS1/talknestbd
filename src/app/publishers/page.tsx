import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRight, Building2, MapPin } from "lucide-react";
import { publishers } from "@/data/publishers";
import { books } from "@/data/books";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "প্রকাশনী",
  description:
    "TalkNest BD-এর সঙ্গে যুক্ত বাংলাদেশের বিশ্বস্ত প্রকাশনী — অন্যধারা, পাঠশালা, মাকতাবাতুল ফুরকানসহ আরও।",
};

export default function PublishersPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Publishers"
        title="যাদের বই পাঠকের হাতে পৌঁছায়"
        description="বাছাই করা প্রকাশনীর বই, তাদের পরিচয় ও সংগ্রহ — সব এক জায়গায়। প্রতিটি প্রকাশনীর সঙ্গে সরাসরি কাজ করি আমরা।"
        crumbs={[{ label: "প্রকাশনী" }]}
      />

      <section className="py-8 sm:py-12">
        <Container>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {publishers.map((publisher) => {
              const publisherBooks = books.filter(
                (book) => book.publisherSlug === publisher.slug,
              );
              return (
                <Link
                  key={publisher.slug}
                  href={`/publishers/${publisher.slug}`}
                  className="group relative overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 p-5 transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_28px_55px_-42px_rgba(10,33,24,0.5)] sm:p-6"
                >
                  <div
                    aria-hidden="true"
                    className="absolute -right-8 -top-10 h-28 w-28 rounded-full border opacity-15"
                    style={{ borderColor: publisher.accent }}
                  />
                  <div className="flex items-start justify-between gap-3">
                    <span
                      className="grid h-14 w-14 place-items-center rounded-2xl font-display text-xl font-bold text-cream-50 shadow-sm"
                      style={{ backgroundColor: publisher.accent }}
                    >
                      {publisher.initials}
                    </span>
                    <ArrowUpRight
                      size={18}
                      className="text-forest-900/25 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-clay-500"
                    />
                  </div>

                  <h2 className="mt-4 font-display text-xl font-bold text-forest-950">
                    {publisher.name}
                  </h2>
                  <p className="mt-1 text-[11px] font-medium" style={{ color: publisher.accent }}>
                    {publisher.tagline}
                  </p>
                  <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-muted">
                    {publisher.description}
                  </p>

                  <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-1.5 border-t border-forest-900/8 pt-3 text-[9px] text-muted">
                    <span className="flex items-center gap-1">
                      <Building2 size={10} />
                      প্রতিষ্ঠা {publisher.established}
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin size={10} />
                      {publisher.location}
                    </span>
                    <span className="ml-auto font-semibold text-forest-800">
                      {toBn(publisherBooks.length)}টি বই
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>

          <div className="relative mt-8 overflow-hidden rounded-[2rem] bg-forest-950 p-6 text-cream-50 sm:p-8">
            <div aria-hidden="true" className="pointer-events-none absolute inset-0 paper-texture opacity-[0.1]" />
            <div className="relative flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
              <div>
                <span className="text-[9px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  For Publishers
                </span>
                <h2 className="mt-1 font-display text-2xl font-bold">
                  আপনার প্রকাশনীকে TalkNest-এ আনুন
                </h2>
                <p className="mt-1 max-w-xl text-[11px] leading-relaxed text-cream-100/55">
                  পাঠকের কাছে পৌঁছাতে চান? আমাদের সঙ্গে যুক্ত হয়ে পাইকারি,
                  ডেলিভারি ও পাঠক কমিউনিটির সুবিধা নিন।
                </p>
              </div>
              <Link
                href="/wholesale"
                className="inline-flex h-10 w-fit shrink-0 items-center gap-1.5 rounded-full bg-gold-500 px-5 text-[11px] font-semibold text-forest-950 transition-colors hover:bg-gold-400"
              >
                যোগাযোগ করুন
                <ArrowUpRight size={13} />
              </Link>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
