import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  BookOpenCheck,
  Building2,
  Headphones,
  Store,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

const wholesaleBenefits = [
  { icon: BadgePercent, label: "Special bulk pricing" },
  { icon: Headphones, label: "Dedicated support" },
  { icon: Truck, label: "Nationwide delivery" },
];

export function FreeOrderWholesale() {
  return (
    <section className="border-y border-brand-100 bg-brand-50/70 py-9 sm:py-12">
      <Container>
        <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
          <SectionTitle
            eyebrow="Books for organisations"
            title="Build a better library for less"
            description="Simple ordering and better prices for schools, libraries, offices, bookshops and reading clubs."
          />
        </div>

        <div className="grid gap-3 sm:gap-4 lg:grid-cols-[1.42fr_0.58fr]">
          <Link
            href="/wholesale"
            className="group relative min-h-[300px] overflow-hidden rounded-[8px] bg-brand-900 p-6 text-white transition-colors hover:bg-brand-800 sm:p-8 lg:min-h-[330px] lg:p-10"
          >
            <div
              aria-hidden="true"
              className="absolute -right-24 -top-32 h-96 w-96 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-36 right-16 h-80 w-80 rounded-full border border-white/10"
            />
            <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.08]" />

            <div className="relative grid h-full gap-8 sm:grid-cols-[minmax(0,1fr)_210px] sm:items-center lg:grid-cols-[minmax(0,1fr)_260px]">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-sale px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.1em] text-ink">
                  <Store size={11} />
                  Wholesale orders
                </span>
                <h3 className="mt-4 max-w-xl text-2xl font-bold leading-tight sm:text-3xl lg:text-[34px]">
                  More books. Better pricing. One helpful team.
                </h3>
                <p className="mt-3 max-w-xl text-[13px] leading-relaxed text-white/68 sm:text-sm">
                  Order 10 copies or more and receive a tailored quote, priority
                  dispatch and support from selection through delivery.
                </p>

                <div className="mt-5 flex flex-wrap gap-2">
                  {wholesaleBenefits.map((benefit) => {
                    const Icon = benefit.icon;
                    return (
                      <span
                        key={benefit.label}
                        className="inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-white/[0.07] px-3 py-1.5 text-[10px] text-white/80"
                      >
                        <Icon size={11} className="text-brand-200" />
                        {benefit.label}
                      </span>
                    );
                  })}
                </div>

                <span className="mt-6 inline-flex h-10 items-center gap-2 rounded-[4px] bg-white px-5 text-[12px] font-semibold text-brand-800 transition-colors group-hover:bg-brand-50">
                  Get a wholesale quote
                  <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>

              <div className="relative hidden h-[230px] sm:block" aria-hidden="true">
                <div className="absolute inset-x-0 bottom-0 mx-auto h-9 w-[190px] rounded-full bg-brand-950/60 blur-xl" />
                <div className="absolute bottom-5 left-1/2 h-[176px] w-[122px] -translate-x-1/2 rounded-[5px] border border-white/20 bg-brand-600 p-4 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.65)]">
                  <BookOpenCheck size={28} className="text-brand-100" />
                  <div className="mt-8 h-2 w-16 rounded-full bg-white/80" />
                  <div className="mt-2 h-1.5 w-12 rounded-full bg-white/35" />
                  <div className="absolute inset-x-4 bottom-4 border-t border-white/15 pt-3 text-[9px] font-medium text-white/60">
                    INSTITUTIONAL COLLECTION
                  </div>
                </div>
                <div className="absolute bottom-4 left-0 h-[144px] w-[92px] -rotate-6 rounded-[5px] border border-white/15 bg-sale/95 p-3 text-ink shadow-[0_18px_30px_-18px_rgba(0,0,0,0.65)]">
                  <Building2 size={23} />
                  <p className="mt-7 text-[11px] font-bold leading-tight">Library essentials</p>
                </div>
                <div className="absolute bottom-4 right-0 h-[150px] w-[94px] rotate-6 rounded-[5px] border border-white/15 bg-[#96DB9D] p-3 text-brand-950 shadow-[0_18px_30px_-18px_rgba(0,0,0,0.65)]">
                  <Store size={23} />
                  <p className="mt-7 text-[11px] font-bold leading-tight">Bookseller picks</p>
                </div>
              </div>
            </div>
          </Link>

          <Link
            href="/free-order"
            className="group relative flex min-h-[220px] flex-col overflow-hidden rounded-[8px] border border-[#ffd08a] bg-[#fff5e6] p-6 transition-colors hover:border-sale sm:p-7 lg:min-h-[330px]"
          >
            <div
              aria-hidden="true"
              className="absolute -right-14 -top-14 h-48 w-48 rounded-full border border-sale/20"
            />
            <span className="relative grid h-12 w-12 place-items-center rounded-[4px] bg-sale text-ink">
              <Truck size={23} />
            </span>
            <div className="relative mt-auto pt-8">
              <span className="text-[9px] font-bold uppercase tracking-[0.12em] text-sale">
                Delivery offer
              </span>
              <h3 className="mt-1.5 text-xl font-bold leading-snug text-ink sm:text-2xl">
                Free nationwide delivery over ৳999
              </h3>
              <p className="mt-2 text-[12px] leading-relaxed text-body">
                Selected books ship free at any order value.
              </p>
              <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-brand-700">
                See delivery details
                <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
