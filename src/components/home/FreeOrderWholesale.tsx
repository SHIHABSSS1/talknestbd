import Link from "next/link";
import { ArrowUpRight, Store, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

export function FreeOrderWholesale() {
  return (
    <section className="py-9 sm:py-12">
      <Container>
        <div className="grid gap-4 lg:grid-cols-2">
          <Link
            href="/free-order"
            className="group relative overflow-hidden rounded-[1.75rem] border border-gold-500/25 bg-cream-200 px-6 py-7 sm:px-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-forest-900/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 right-12 h-40 w-40 rounded-full bg-gold-400/20 blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-5">
              <div className="max-w-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  <Truck size={12} />
                  Free Order
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold leading-snug text-forest-950 sm:text-[1.75rem]">
                  ৳৯৯৯+ অর্ডারে সারা দেশে ফ্রি ডেলিভারি
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-forest-800/70 sm:text-[13px]">
                  ঘরে বসে বইয়ের অর্ডার করুন। নির্দিষ্ট বইয়ে ফ্রি ডেলিভারি
                  সুবিধা তো থাকছেই।
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-clay-600">
                  ফ্রি অর্ডার করুন
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-forest-950 text-gold-300 sm:h-16 sm:w-16">
                <Truck size={27} strokeWidth={1.5} />
              </span>
            </div>
          </Link>

          <Link
            href="/wholesale"
            className="group relative overflow-hidden rounded-[1.75rem] bg-forest-900 px-6 py-7 text-cream-50 sm:px-8"
          >
            <div
              aria-hidden="true"
              className="absolute -right-10 -top-12 h-40 w-40 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-16 right-12 h-40 w-40 rounded-full bg-gold-400/10 blur-2xl"
            />
            <div className="relative flex items-start justify-between gap-5">
              <div className="max-w-sm">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  <Store size={12} />
                  Wholesale
                </span>
                <h2 className="mt-4 font-display text-2xl font-bold leading-snug sm:text-[1.75rem]">
                  লাইব্রেরি বা ব্যবসার জন্য পাইকারি দাম
                </h2>
                <p className="mt-2 text-xs leading-relaxed text-cream-100/60 sm:text-[13px]">
                  ১০ কপি থেকে অর্ডারে বিশেষ কমিশন, দ্রুত ডেলিভারি আর ডেডিকেটেড
                  সাপোর্ট।
                </p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-[12px] font-semibold text-gold-300">
                  পাইকারি অর্ডার করুন
                  <ArrowUpRight size={14} />
                </span>
              </div>
              <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/10 text-gold-300 sm:h-16 sm:w-16">
                <Store size={27} strokeWidth={1.5} />
              </span>
            </div>
          </Link>
        </div>
      </Container>
    </section>
  );
}
