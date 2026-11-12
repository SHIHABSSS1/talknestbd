import Link from "next/link";
import { ArrowUpRight, Store, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function FreeOrderWholesale() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="grid gap-3 sm:gap-4 lg:grid-cols-2">
          <Link
            href="/free-order"
            className="group relative overflow-hidden rounded-[8px] border border-brand-200 bg-brand-50 px-5 py-6 transition-colors hover:border-brand-400 sm:px-7"
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-brand-200"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="max-w-sm">
                <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-brand-600 px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-white">
                  <Truck size={11} />
                  Free delivery
                </span>
                <h2 className="mt-3 text-xl font-bold leading-snug text-ink sm:text-2xl">
                  Free delivery on orders over ৳999
                </h2>
                <p className="mt-2 text-[12px] leading-relaxed text-body sm:text-[13px]">
                  Books delivered to your door anywhere in Bangladesh — and
                  selected titles ship free at any order value.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-brand-700">
                  Order with free delivery
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[4px] bg-brand-600 text-white sm:h-14 sm:w-14">
                <Truck size={24} strokeWidth={1.6} />
              </span>
            </div>
          </Link>

          <Link
            href="/wholesale"
            className="group relative overflow-hidden rounded-[8px] border border-[#ffd08a] bg-[#fff5e6] px-5 py-6 transition-colors hover:border-sale sm:px-7"
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-sale/15"
            />
            <div className="relative flex items-start justify-between gap-4">
              <div className="max-w-sm">
                <span className="inline-flex items-center gap-1.5 rounded-[3px] bg-sale px-2.5 py-1 text-[9px] font-semibold uppercase tracking-[0.1em] text-ink">
                  <Store size={11} />
                  Wholesale
                </span>
                <h2 className="mt-3 text-xl font-bold leading-snug text-ink sm:text-2xl">
                  Better prices for libraries and shops
                </h2>
                <p className="mt-2 text-[12px] leading-relaxed text-body sm:text-[13px]">
                  Order 10 copies or more for special commission, priority
                  dispatch and a dedicated account manager.
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-[12px] font-medium text-brand-700">
                  Request wholesale pricing
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
                  />
                </span>
              </div>
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-[4px] bg-sale text-ink sm:h-14 sm:w-14">
                <Store size={24} strokeWidth={1.6} />
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
