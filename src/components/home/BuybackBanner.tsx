import Link from "next/link";
import { ArrowRight, Banknote, CheckCircle2, Repeat2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

const steps = [
  {
    icon: Repeat2,
    title: "বইটি কিনুন",
    text: "TalkNest BD থেকে যেকোনো বই কিনুন।",
  },
  {
    icon: ShieldCheck,
    title: "পড়ে শেষ করুন",
    text: "বই ভালোবাসায় পড়ুন, যত্নে রাখুন।",
  },
  {
    icon: Banknote,
    title: "৫০% ফিরে পান",
    text: "ফেরত দিলে আমাদের দামের ৫০% ক্যাশ।",
  },
];

export function BuybackBanner() {
  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="relative overflow-hidden rounded-[2rem] bg-forest-950 px-6 py-9 text-cream-50 soft-shadow sm:px-10 sm:py-12 lg:px-14">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-32 h-96 w-96 rounded-full border border-gold-400/20"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-36 -left-24 h-80 w-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 paper-texture opacity-[0.12]"
          />
          <div className="relative grid gap-10 lg:grid-cols-[0.72fr_1.28fr] lg:items-center">
            <div className="flex items-center gap-5">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full border border-gold-400/30 bg-gold-500 text-forest-950 sm:h-36 sm:w-36">
                <span className="absolute inset-2 rounded-full border border-forest-950/15" />
                <span className="font-display text-4xl font-bold sm:text-5xl">৫০%</span>
                <span className="absolute -bottom-3 rounded-full bg-cream-50 px-3 py-1 text-[9px] font-semibold text-forest-950 shadow">
                  ক্যাশ ফেরত
                </span>
              </div>
              <div className="lg:hidden">
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-gold-400">
                  TalkNest Buyback
                </p>
                <p className="mt-1 font-display text-xl font-semibold">
                  পড়া শেষ? বই ফেরত দিন।
                </p>
              </div>
            </div>

            <div>
              <p className="hidden text-[10px] font-semibold uppercase tracking-[0.22em] text-gold-400 sm:text-[11px] lg:block">
                TalkNest Buyback · বই ফেরত কর্মসূচি
              </p>
              <h2 className="mt-1.5 max-w-2xl font-display text-2xl font-bold leading-snug sm:text-3xl lg:text-[2.4rem]">
                বই পড়া শেষ? ফেরত দিন, ফিরে পান{" "}
                <span className="text-gold-300">মূল্যের ৫০%।</span>
              </h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-cream-100/65">
                TalkNest BD থেকে কেনা বই পড়া শেষ হলে আমাদের কাছেই বিক্রি করে দিন।
                বইটি পাঠযোগ্য থাকলেই আপনি পাবেন আমাদের বিক্রয়মূল্যের ৫০% ফেরত —
                সহজ, স্বচ্ছ আর ঝামেলাহীন।
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex items-start gap-3 rounded-xl border border-white/10 bg-white/5 p-3.5"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-gold-500 text-forest-950">
                        <Icon size={15} />
                      </span>
                      <span>
                        <span className="block text-[11px] font-semibold text-cream-50">
                          {index + 1}. {step.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-snug text-cream-100/50">
                          {step.text}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-6 flex flex-wrap items-center gap-4">
                <Button href="/buyback" variant="gold">
                  বিস্তারিত জানুন
                  <ArrowRight size={16} />
                </Button>
                <Link
                  href="/buyback#calculator"
                  className="inline-flex items-center gap-1.5 text-xs font-medium text-cream-100/65 transition-colors hover:text-gold-300"
                >
                  <CheckCircle2 size={14} />
                  কত টাকা ফেরত পাবেন?
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
