import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { notFound } from "next/navigation";
import {
  BadgeCheck,
  CheckCircle2,
  Gift,
  PackageCheck,
  ShieldCheck,
  Tag,
  Truck,
} from "lucide-react";
import { sunnahItems } from "@/data/sunnah";
import { discountPercent, toBn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Breadcrumb } from "@/components/ui/Breadcrumb";
import { Badge } from "@/components/ui/Badge";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
import { SunnahItemArt } from "@/components/sunnah/SunnahItemArt";
import { SunnahPurchasePanel } from "@/components/sunnah/SunnahPurchasePanel";
import { SunnahDetailTabs } from "@/components/sunnah/SunnahDetailTabs";
import { SunnahItemCard } from "@/components/sunnah/SunnahItemCard";

export function generateStaticParams() {
  return sunnahItems.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const item = sunnahItems.find((entry) => entry.slug === slug);
  if (!item) return { title: "Sunnah Essentials" };

  return {
    title: item.name,
    description: `${item.subtitle}. ${item.description}`,
    openGraph: {
      title: `${item.name} — TalkNest BD`,
      description: item.description,
      type: "website",
    },
  };
}

export default function SunnahItemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  return (
    <Suspense fallback={<SunnahItemSkeleton />}>
      <SunnahItemContent params={params} />
    </Suspense>
  );
}

async function SunnahItemContent({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const item = sunnahItems.find((entry) => entry.slug === slug);
  if (!item) notFound();

  const discount = discountPercent(item.price, item.oldPrice);
  const related = sunnahItems.filter((entry) => entry.slug !== item.slug).slice(0, 4);

  return (
    <>
      <section className="border-b border-forest-900/8 bg-cream-100/40">
        <Container className="py-6 sm:py-9">
          <Breadcrumb
            items={[
              { label: "Sunnah Essentials", href: "/sunnah-items" },
              { label: item.name },
            ]}
          />

          <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
            <div className="lg:sticky lg:top-[88px] lg:self-start">
              <div className="relative mx-auto max-w-[340px] rounded-3xl bg-cream-200/80 p-5 sm:p-6">
                <div
                  aria-hidden="true"
                  className="absolute -right-6 -top-6 h-24 w-24 rounded-full border border-forest-900/10"
                />
                <div className="relative">
                  <SunnahItemArt item={item} size="detail" showBadge={false} />
                </div>
                <div className="absolute left-7 top-7 flex flex-wrap gap-1.5">
                  {item.badge && <Badge tone="gold">{item.badge}</Badge>}
                  {discount && (
                    <span className="rounded-full bg-clay-500 px-2.5 py-1 text-[10px] font-bold leading-none text-cream-50">
                      {toBn(discount)}% off
                    </span>
                  )}
                </div>
              </div>

              <div className="mx-auto mt-3 max-w-[340px] rounded-2xl border border-dashed border-forest-500/25 bg-forest-50 px-4 py-3.5">
                <div className="flex items-start gap-2.5">
                  <Gift size={16} className="mt-0.5 shrink-0 text-gold-600" />
                  <div>
                    <p className="text-[11px] font-semibold text-forest-900">
                      Gift-ready packaging
                    </p>
                    <p className="mt-0.5 text-[10px] leading-relaxed text-forest-800/65">
                      Add a free handwritten note when you order.
                    </p>
                    <Link
                      href="/contact"
                      className="mt-1 inline-flex text-[10px] font-semibold text-clay-600 hover:text-clay-500"
                    >
                      Ask us about gifting →
                    </Link>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <Badge tone="forest">{item.category}</Badge>
                <Badge tone="outline">Sunnah essential</Badge>
                <span className="rounded-full bg-forest-50 px-2.5 py-1 text-[10px] font-medium leading-none text-forest-700">
                  In stock
                </span>
              </div>

              <h1 className="mt-3 font-display text-3xl font-bold leading-tight tracking-tight text-forest-950 sm:text-4xl lg:text-[2.8rem]">
                {item.name}
              </h1>
              <p className="mt-2 text-sm text-muted sm:text-base">{item.subtitle}</p>

              <div className="mt-4 grid gap-2 sm:grid-cols-3">
                <div className="flex items-center gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <Tag size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">
                      Category
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950">
                      {item.category}
                    </span>
                  </span>
                </div>

                <div className="flex items-center gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3">
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-gold-500/15 text-gold-600">
                    <PackageCheck size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">
                      Availability
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950">
                      {item.stock > 6
                        ? `${toBn(item.stock)} in stock`
                        : `Only ${toBn(item.stock)} left`}
                    </span>
                  </span>
                </div>

                <Link
                  href="/free-order"
                  className="group flex items-center gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 p-3 transition-colors hover:border-forest-900/25"
                >
                  <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <Truck size={15} />
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[9px] uppercase tracking-[0.14em] text-muted">
                      Delivery
                    </span>
                    <span className="block truncate text-[11px] font-semibold text-forest-950 group-hover:text-clay-600">
                      2–4 days in Dhaka
                    </span>
                  </span>
                </Link>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-3">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
                  <BadgeCheck size={13} className="text-forest-600" />
                  Hand-picked essential
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
                  <ShieldCheck size={13} className="text-forest-600" />
                  Checked before packing
                </span>
              </div>

              <div className="mt-5">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
                  Overview
                </p>
                <p className="mt-1.5 max-w-2xl text-sm leading-relaxed text-forest-900/75 sm:text-[15px]">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 grid gap-2 sm:grid-cols-2">
                {item.highlights.map((highlight) => (
                  <div
                    key={highlight}
                    className="flex items-start gap-2 text-[11px] text-forest-800/75"
                  >
                    <CheckCircle2
                      size={14}
                      className="mt-0.5 shrink-0 text-forest-500"
                    />
                    {highlight}
                  </div>
                ))}
              </div>

              <div className="mt-7 border-t border-forest-900/10 pt-6">
                <SunnahPurchasePanel item={item} />
              </div>

              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 border-t border-forest-900/10 pt-4 text-[10px] text-muted">
                <span className="flex items-center gap-1.5">
                  <Tag size={13} />
                  {item.category}
                </span>
                <span className="flex items-center gap-1.5">
                  <PackageCheck size={13} />
                  {toBn(item.stock)} in stock
                </span>
                <span className="flex items-center gap-1.5">
                  <Gift size={13} />
                  Gift packing
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} />
                  Checked by TalkNest
                </span>
              </div>

              <div className="mt-6 flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-700">
                  <BadgeCheck size={22} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-[9px] uppercase tracking-[0.15em] text-muted">
                    TalkNest promise
                  </p>
                  <p className="text-sm font-semibold text-forest-950">
                    Hand-picked Sunnah essentials
                  </p>
                  <p className="line-clamp-1 text-[10px] text-muted">
                    Inspected, packed and delivered with care.
                  </p>
                </div>
                <Link
                  href="/about"
                  className="shrink-0 rounded-full border border-forest-900/15 px-3 py-1.5 text-[10px] font-medium text-forest-800 transition-colors hover:border-forest-900"
                >
                  Learn more
                </Link>
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="py-8 sm:py-12">
        <Container>
          <SunnahDetailTabs item={item} />
        </Container>
      </section>

      <section className="border-b border-line bg-white py-8 sm:py-10">
        <Container>
          <SectionHeader
            eyebrow="You may also like"
            title="More Sunnah essentials"
            description="Small, thoughtful additions for everyday practice."
            href="/sunnah-items"
            linkLabel="All essentials"
            className="mb-6 sm:mb-7"
          />
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {related.map((entry) => (
              <SunnahItemCard key={entry.slug} item={entry} />
            ))}
          </div>
          <ViewAllRow
            href="/sunnah-items"
            label="All essentials"
            count={`${sunnahItems.length} items`}
          />
        </Container>
      </section>
    </>
  );
}

function SunnahItemSkeleton() {
  return (
    <section
      aria-busy="true"
      aria-label="Loading Sunnah essential"
      className="border-b border-forest-900/8 bg-cream-100/40"
    >
      <Container className="py-6 sm:py-9">
        <div className="h-3 w-52 animate-pulse rounded-full bg-cream-300/70" />

        <div className="mt-6 grid gap-8 lg:grid-cols-[360px_1fr] lg:gap-12 xl:gap-16">
          <div className="lg:sticky lg:top-[88px] lg:self-start">
            <div className="mx-auto aspect-[4/5] max-w-[340px] animate-pulse rounded-3xl bg-cream-200" />
            <div className="mx-auto mt-3 h-16 max-w-[340px] animate-pulse rounded-2xl bg-cream-200/70" />
          </div>

          <div>
            <div className="flex flex-wrap gap-2">
              <div className="h-6 w-24 animate-pulse rounded-full bg-cream-200" />
              <div className="h-6 w-28 animate-pulse rounded-full bg-cream-200" />
            </div>
            <div className="mt-4 h-10 w-3/4 animate-pulse rounded-xl bg-cream-200" />
            <div className="mt-2 h-4 w-1/2 animate-pulse rounded-full bg-cream-200" />

            <div className="mt-5 grid gap-2 sm:grid-cols-3">
              {[0, 1, 2].map((index) => (
                <div
                  key={index}
                  className="h-[66px] animate-pulse rounded-2xl bg-cream-100"
                />
              ))}
            </div>

            <div className="mt-6 space-y-2">
              <div className="h-3 w-20 animate-pulse rounded-full bg-cream-200" />
              <div className="h-3 w-full animate-pulse rounded-full bg-cream-200" />
              <div className="h-3 w-5/6 animate-pulse rounded-full bg-cream-200" />
              <div className="h-3 w-2/3 animate-pulse rounded-full bg-cream-200" />
            </div>

            <div className="mt-7 h-14 w-full animate-pulse rounded-2xl bg-cream-200" />
          </div>
        </div>
      </Container>

      <Container className="pb-8 sm:pb-12">
        <div className="h-12 animate-pulse rounded-3xl bg-cream-200/70" />
      </Container>
    </section>
  );
}
