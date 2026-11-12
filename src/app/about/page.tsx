import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookHeart,
  BookOpen,
  Building2,
  Clock3,
  Compass,
  HeartHandshake,
  Leaf,
  LibraryBig,
  Mail,
  MapPin,
  Mic,
  PenLine,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { siteConfig, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "TalkNest BD is a warm nest for Bangladeshi readers — books, audio, stories and community. Our story, mission and journey.",
};

const stats = [
  { value: "20,000+", label: "Happy readers" },
  { value: "1,200+", label: "Books in our collection" },
  { value: "84", label: "Audio stories" },
  { value: "64", label: "Districts served" },
];

const values = [
  {
    icon: BookOpen,
    title: "Good books within everyone's reach",
    text: "Curated titles, honest reviews and fair prices — getting the right book into a reader's hands is our first job.",
  },
  {
    icon: HeartHandshake,
    title: "Readers are our family",
    text: "Reviews, stories, quizzes and conversation keep readers close to us. Their love is what keeps us going.",
  },
  {
    icon: Leaf,
    title: "A second life for books",
    text: "Buyback and our used-book market send books on to new readers — and cut down on paper waste.",
  },
  {
    icon: ShieldCheck,
    title: "Transparency and trust",
    text: "100% original books, clear prices, on-time delivery and easy returns — no hidden surprises.",
  },
];

const milestones = [
  {
    year: "2022",
    title: "It began with a small reading circle",
    text: "TalkNest started with friends swapping books and talking about them.",
  },
  {
    year: "2023",
    title: "Our online collection launches",
    text: "The website went live with 200 books, with delivery starting inside Dhaka.",
  },
  {
    year: "2024",
    title: "Audio and community",
    text: "Audiobooks, reader stories and author interviews made the platform richer.",
  },
  {
    year: "2025",
    title: "50% buyback and wholesale",
    text: "Buyback, the used-book market and institutional orders completed the circle for books.",
  },
  {
    year: "2026",
    title: "A reading home across the country",
    text: "Delivery in all 64 districts, thousands of readers and many more stories ahead.",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="A warm nest for books, stories and people"
        description="TalkNest BD started from a simple belief — good books should reach everyone, and no reader should make that journey alone. Today we're spreading that belief across the country."
        tone="dark"
        crumbs={[{ label: "About Us" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Established 2022
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Dhaka, Bangladesh
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Reader-first platform
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] border border-forest-900/8 bg-cream-100">
              <div className="aspect-[16/11] w-full">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80"
                  alt="TalkNest book collection"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                <span className="h-px w-5 bg-clay-500/50" /> Why TalkNest
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl lg:text-[2.2rem]">
                Picking up a book means
                <span className="text-clay-600"> stepping into a new world</span>
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-forest-900/70">
                We believe a book is more than words on a page — it is a source of
                courage, comfort and possibility. But finding good books, buying them
                at a fair price and getting them home is not easy for everyone.
                TalkNest exists to close that gap.
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-forest-900/70">
                Bangla literature, Islamic history, world literature in translation,
                student books and audio — all under one roof. Alongside a space for
                readers to tell their own stories, easy returns, and direct access to
                authors and publishers.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href="/books" size="sm">
                  Browse books <ArrowRight size={13} />
                </Button>
                <Button href="/contact" variant="outline" size="sm">
                  Contact us
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-4 text-center">
                <p className="font-display text-2xl font-bold text-forest-950 sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[9px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                <span className="h-px w-5 bg-clay-500/50" /> Our Values
              </span>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                What we believe in
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <value.icon size={18} />
                  </span>
                  <h3 className="mt-3 font-display text-sm font-bold leading-snug text-forest-950">{value.title}</h3>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-muted">{value.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <section className="rounded-3xl bg-forest-950 p-6 text-cream-50 sm:p-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                <Compass size={11} /> Our Journey
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold leading-snug">
                From a small reading circle to a home across the country
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-cream-100/55">
                Every milestone in our five-year journey was made by readers. The road
                continues — to more books, more stories and more people.
              </p>
              <div className="mt-5 space-y-4">
                {milestones.map((item, index) => (
                  <div key={item.year} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500 font-display text-[9px] font-bold text-forest-950">
                        {toBn(index + 1)}
                      </span>
                      {index < milestones.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-white/15" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-400">{item.year}</p>
                      <p className="mt-0.5 text-[12px] font-semibold text-cream-50">{item.title}</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-cream-100/45">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-4">
              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                  <Users size={17} className="text-forest-600" /> Our team
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  A small team with a big love for books. Some of us curate titles, some
                  write reviews, and some shape our audio and stories.
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { name: "Tanzila Ahmed", role: "Editorial & Community", icon: PenLine },
                    { name: "Arif Khan", role: "Audio & Video Curation", icon: Mic },
                    { name: "Sadia Islam", role: "Customer Care & Delivery", icon: Truck },
                    { name: "Tanvir Rahman", role: "Book Curation & Publisher Relations", icon: LibraryBig },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center gap-2.5 rounded-xl bg-cream-100/60 px-3 py-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-gold-300">
                        {member.name.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-semibold text-forest-950">{member.name}</span>
                        <span className="block truncate text-[8px] text-muted">{member.role}</span>
                      </span>
                      <member.icon size={13} className="ml-auto shrink-0 text-forest-900/20" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                  <MapPin size={17} className="text-forest-600" /> Head office
                </h2>
                <div className="mt-3 space-y-2 text-[11px] text-forest-800">
                  <p className="flex items-start gap-2">
                    <Building2 size={13} className="mt-0.5 shrink-0 text-forest-600" />
                    {siteConfig.address}
                  </p>
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-clay-600">
                    <Phone size={13} className="shrink-0 text-forest-600" /> {siteConfig.phone}
                  </a>
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-clay-600">
                    <Mail size={13} className="shrink-0 text-forest-600" /> {siteConfig.email}
                  </a>
                  <p className="flex items-center gap-2">
                    <Clock3 size={13} className="shrink-0 text-forest-600" /> Sat–Thu, 10:00 AM – 8:00 PM
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
                  <SocialLinks iconSize={15} className="text-forest-700" />
                  <Link href="/contact" className="text-[10px] font-semibold text-clay-600 hover:text-clay-500">
                    View on map →
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
                  <Sparkles size={13} className="text-gold-600" /> Our promise
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  Every book is 100% original and every reader matters. If something goes
                  wrong, we listen and make it right — that is the TalkNest promise.
                </p>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-clay-500 px-5 py-4 text-cream-50 sm:flex-row">
            <p className="flex items-center gap-2 text-center text-xs font-medium sm:text-left">
              <BookHeart size={16} /> We want to be by your side — from books to every story in life.
            </p>
            <Button href="/stories" variant="light" size="sm">
              Read reader stories
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
