import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock3,
  Gift,
  MapPin,
  PackageCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BookGrid } from "@/components/books/BookGrid";
import { Button } from "@/components/ui/Button";
import { freeDeliveryBooks } from "@/data/books";
import { formatPrice, siteConfig, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "ফ্রি ডেলিভারি",
  description:
    "৳৯৯৯ ও তার বেশি অর্ডারে সারা বাংলাদেশে ফ্রি ডেলিভারি। নির্বাচিত বইয়ে সবসময় ফ্রি ডেলিভারি — TalkNest BD।",
};

const steps = [
  {
    icon: ShoppingBag,
    title: "বই বেছে নিন",
    text: `কার্টে ${formatPrice(siteConfig.freeDeliveryThreshold)} বা তার বেশি মূল্যের বই যোগ করুন।`,
  },
  {
    icon: Gift,
    title: "ফ্রি ডেলিভারি স্বয়ংক্রিয়",
    text: "চেকআউটে ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে ৳০ হয়ে যাবে — কোনো কুপন কোড লাগবে না।",
  },
  {
    icon: Truck,
    title: "ঘরে পৌঁছে যাবে",
    text: "ঢাকায় ২–৪ ও ঢাকার বাইরে ৩–৭ কর্মদিবসের মধ্যে বই পৌঁছে যাবে।",
  },
];

const zones = [
  { zone: "ঢাকা সিটি", time: "২–৪ কর্মদিবস", charge: 60 },
  { zone: "ঢাকা জেলার বাইরে", time: "৩–৭ কর্মদিবস", charge: 120 },
  { zone: "চট্টগ্রাম, সিলেট, রাজশাহী", time: "৩–৭ কর্মদিবস", charge: 120 },
  { zone: "দুর্গম ও পার্বত্য এলাকা", time: "৫–১০ কর্মদিবস", charge: 150 },
];

export default function FreeOrderPage() {
  return (
    <>
      <PageHeader
        eyebrow="Free Delivery"
        title="৳৯৯৯+ অর্ডারে সারা দেশে ফ্রি ডেলিভারি"
        description="বইয়ের দামেই ডেলিভারি ফ্রি — আলাদা করে চার্জের চিন্তা নেই। নির্দিষ্ট কিছু বইয়ে আবার সবসময় ফ্রি ডেলিভারি সুবিধা থাকছে।"
        tone="dark"
        crumbs={[{ label: "ফ্রি ডেলিভারি" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            কোড ছাড়াই স্বয়ংক্রিয়
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            সারাদেশে প্রযোজ্য
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            নির্বাচিত বইয়ে সবসময় ফ্রি
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="relative overflow-hidden rounded-[2rem] bg-cream-200 p-5 sm:p-8">
            <div aria-hidden="true" className="absolute -right-16 -top-20 h-60 w-60 rounded-full border border-forest-900/10" />
            <div aria-hidden="true" className="absolute -bottom-24 right-24 h-60 w-60 rounded-full bg-gold-400/20 blur-2xl" />
            <div className="relative grid gap-6 lg:grid-cols-[1fr_0.8fr] lg:items-center">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-forest-950 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                  <Truck size={12} /> Free Delivery
                </span>
                <h2 className="mt-4 max-w-xl font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl">
                  আপনার কার্টে {formatPrice(siteConfig.freeDeliveryThreshold)} হলে ডেলিভারি একদম ফ্রি
                </h2>
                <p className="mt-2 max-w-xl text-xs leading-relaxed text-forest-800/65 sm:text-[13px]">
                  কার্টের মোট মূল্য {formatPrice(siteConfig.freeDeliveryThreshold)} বা তার
                  বেশি হলেই ডেলিভারি চার্জ স্বয়ংক্রিয়ভাবে বাদ যাবে। একটি বইয়ের দাম
                  কম হলেও প্রিয় বই কিনুন আর উপহারের জন্য বেছে নিন।
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Button href="/books" size="sm">
                    বই ঘুরে দেখুন
                    <ArrowRight size={13} />
                  </Button>
                  <Button href="/cart" variant="outline" size="sm">
                    কার্টে যান
                  </Button>
                </div>
              </div>
              <div className="rounded-2xl border border-forest-900/10 bg-cream-50/90 p-5">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-clay-500">
                  threshold
                </p>
                <div className="mt-1 flex items-end gap-2">
                  <p className="font-display text-5xl font-bold leading-none text-forest-950">
                    {formatPrice(siteConfig.freeDeliveryThreshold)}
                  </p>
                  <span className="pb-1 text-[11px] text-muted">বা তার বেশি</span>
                </div>
                <div className="mt-3 space-y-2 border-t border-dashed border-forest-900/15 pt-3 text-[10px]">
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-muted">সাধারণ ডেলিভারি চার্জ</span>
                    <span className="font-semibold text-forest-900">{formatPrice(60)}</span>
                  </p>
                  <p className="flex items-center justify-between gap-2">
                    <span className="text-muted">থ্রেশহোল্ডের পর</span>
                    <span className="font-semibold text-forest-600">৳০ (ফ্রি)</span>
                  </p>
                </div>
                <p className="mt-3 flex items-center gap-1.5 rounded-lg bg-forest-100/70 px-2.5 py-2 text-[9px] text-forest-800">
                  <BadgeCheck size={11} /> ডেমো সাইটে চার্জটি শুধু হিসাবের জন্য দেখানো হয়
                </p>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {steps.map((step, index) => (
              <div key={step.title} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <step.icon size={17} />
                  </span>
                  <span className="font-display text-2xl font-bold text-forest-900/15">
                    {toBn(index + 1)}
                  </span>
                </div>
                <h2 className="mt-3 text-[12px] font-semibold text-forest-950">{step.title}</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[1.2fr_0.8fr] lg:items-start">
            <section className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-forest-900/8 bg-cream-100/50 px-5 py-4">
                <div>
                  <h2 className="font-display text-lg font-bold text-forest-950">
                    নির্বাচিত ফ্রি-ডেলিভারি বই
                  </h2>
                  <p className="mt-0.5 text-[10px] text-muted">
                    কার্টে যোগ করলেই এই বইগুলোর ডেলিভারি সম্পূর্ণ ফ্রি।
                  </p>
                </div>
                <Link href="/books" className="text-[10px] font-semibold text-clay-600 hover:text-clay-500">
                  সব বই →
                </Link>
              </div>
              <div className="p-4 sm:p-5">
                <BookGrid books={freeDeliveryBooks.slice(0, 8)} columns="four" />
              </div>
            </section>

            <div className="space-y-4">
              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
                  <MapPin size={16} className="text-forest-600" />
                  ডেলিভারি চার্জ ও সময়
                </h2>
                <div className="mt-3 divide-y divide-forest-900/8">
                  {zones.map((zone) => (
                    <div key={zone.zone} className="flex items-center justify-between gap-3 py-2.5">
                      <div>
                        <p className="text-[11px] font-medium text-forest-900">{zone.zone}</p>
                        <p className="flex items-center gap-1 text-[9px] text-muted">
                          <Clock3 size={9} />
                          {zone.time}
                        </p>
                      </div>
                      <span className="shrink-0 text-[10px] font-semibold text-forest-800">
                        {formatPrice(zone.charge)}
                      </span>
                    </div>
                  ))}
                </div>
                <p className="mt-2 rounded-lg bg-gold-500/10 px-2.5 py-2 text-[9px] leading-relaxed text-forest-800/70">
                  উৎসব বা ঈদের সময় কুরিয়ার চাপে ডেলিভারি ১–২ দিন বাড়তে পারে।
                </p>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950">
                  <PackageCheck size={16} className="text-forest-600" />
                  যা মনে রাখবেন
                </h2>
                <ul className="mt-3 space-y-2">
                  {[
                    "ফ্রি ডেলিভারি কার্টের মোট মূল্যের উপর নির্ভর করে",
                    "একাধিক বই একসঙ্গে কিনলে দ্রুত থ্রেশহোল্ডে পৌঁছাবেন",
                    "এক্সপ্রেস ডেলিভারি চাইলে আলাদা চার্জ প্রযোজ্য",
                    "রিটার্নের ক্ষেত্রে ডেলিভারি চার্জ ফেরত হয় না",
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75">
                      <CheckCircle2 size={12} className="mt-0.5 shrink-0 text-forest-500" />
                      {item}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="rounded-3xl bg-forest-950 p-5 text-cream-50">
                <Banknote size={20} className="text-gold-400" />
                <h2 className="mt-2 font-display text-base font-bold">পেমেন্ট নিয়ে চিন্তা নেই</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-cream-100/55">
                  ক্যাশ অন ডেলিভারি, বিকাশ ও নগদ — পছন্দের পদ্ধতিতে পেমেন্ট করুন।
                  ডেমো সাইটে কোনো আসল টাকা কাটা হয় না।
                </p>
                <Button href="/checkout" variant="gold" size="sm" className="mt-3">
                  চেকআউট দেখুন
                </Button>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 px-5 py-4 sm:flex-row">
            <p className="text-center text-[11px] text-forest-800/70 sm:text-left">
              ডেলিভারি সংক্রান্ত প্রশ্ন? আমাদের টিম সকাল ১০টা – রাত ৮টা পর্যন্ত পাশে আছে।
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/contact" variant="primary" size="sm">যোগাযোগ</Button>
              <Button href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" variant="outline" size="sm">
                হোয়াটসঅ্যাপ
              </Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
