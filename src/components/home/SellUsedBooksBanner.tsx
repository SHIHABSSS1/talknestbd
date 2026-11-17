import Link from "next/link";
import { ArrowRight, Banknote, CheckCircle2, Repeat2, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { SectionTitle } from "@/components/ui/SectionTitle";

const steps = [
  {
    icon: Repeat2,
    title: "Buy a book",
    text: "Choose any title from the TalkNest store.",
  },
  {
    icon: ShieldCheck,
    title: "Read and enjoy",
    text: "Take your time and keep the book in good shape.",
  },
  {
    icon: Banknote,
    title: "Get 50% back",
    text: "Return it to us for half the purchase price in cash.",
  },
];

export function BuybackBanner() {
  return (
    <section className="bg-canvas py-8 sm:py-10">
      <Container>
        <div className="relative overflow-hidden rounded-[8px] bg-brand-900 px-6 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
          <div
            aria-hidden="true"
            className="absolute -right-20 -top-28 h-80 w-80 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute -bottom-28 -left-16 h-64 w-64 rounded-full border border-white/10"
          />
          <div
            aria-hidden="true"
            className="absolute inset-0 paper-texture opacity-[0.08]"
          />

          <div className="relative grid gap-7 lg:grid-cols-[190px_minmax(0,1fr)] lg:items-center lg:gap-10">
            <div className="flex items-center gap-5 lg:flex-col lg:items-start">
              <div className="relative grid h-28 w-28 shrink-0 place-items-center rounded-full bg-sale text-ink sm:h-32 sm:w-32">
                <span className="text-4xl font-bold leading-none">50%</span>
                <span className="absolute -bottom-2 rounded-full bg-white px-3 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-brand-800">
                  cash back
                </span>
              </div>
            </div>

            <div>
              <SectionTitle
                light
                size="lg"
                eyebrow="TalkNest Buyback"
                title={
                  <>
                    Finished a book? Return it and get{" "}
                    <span className="text-sale">50% back.</span>
                  </>
                }
                description="Buy any book from TalkNest, read it at your own pace, then send it back in readable condition. We will refund half the purchase price — simple, transparent and hassle-free."
              />

              <div className="mt-5 grid gap-2.5 sm:grid-cols-3">
                {steps.map((step, index) => {
                  const Icon = step.icon;
                  return (
                    <div
                      key={step.title}
                      className="flex items-start gap-2.5 rounded-[4px] border border-white/10 bg-white/[0.06] p-3"
                    >
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-[4px] bg-white/10 text-brand-200">
                        <Icon size={14} />
                      </span>
                      <span className="min-w-0">
                        <span className="block text-[11px] font-semibold text-white">
                          {index + 1}. {step.title}
                        </span>
                        <span className="mt-0.5 block text-[10px] leading-snug text-white/55">
                          {step.text}
                        </span>
                      </span>
                    </div>
                  );
                })}
              </div>

              <div className="mt-5 flex flex-wrap items-center gap-4">
                <Button href="/buyback" variant="white">
                  See how buyback works
                  <ArrowRight size={15} />
                </Button>
                <Link
                  href="/buyback#calculator"
                  className="inline-flex items-center gap-1.5 text-[11px] font-medium text-white/70 transition-colors hover:text-white"
                >
                  <CheckCircle2 size={13} />
                  Estimate your refund
                </Link>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
