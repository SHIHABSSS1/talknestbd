import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Banknote,
  BookOpenCheck,
  CheckCircle2,
  Clock3,
  HeartHandshake,
  Package,
  Recycle,
  Repeat2,
  ShieldCheck,
  Sparkles,
  XCircle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { BuybackCalculator } from "@/components/services/BuybackCalculator";
import { Button } from "@/components/ui/Button";
import { siteConfig, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "50% Book Buyback",
  description:
    "Finished a book you bought from TalkNest BD? Send it back and get up to 50% of the purchase price in cash. Simple buyback process and calculator.",
};

const steps = [
  {
    icon: BookOpenCheck,
    title: "Finish the book",
    text: "Read and take good care of any book you bought from TalkNest BD.",
  },
  {
    icon: Package,
    title: "Send photos and your order number",
    text: "Share photos of the front and back, the binding and your order number on WhatsApp.",
  },
  {
    icon: ShieldCheck,
    title: "Inspection and offer",
    text: "Our team checks the book's condition and confirms the final buyback value.",
  },
  {
    icon: Banknote,
    title: "Get 50% cash back",
    text: "Once the book reaches us, we send your money via bKash or Nagad within 3–5 business days.",
  },
];

const accepted = [
  "Books bought from TalkNest BD",
  "Pages, binding and cover intact",
  "Light marks from normal reading are fine",
  "Order number or proof of purchase",
];

const notAccepted = [
  "Books damaged by water, oil or ink",
  "Torn pages or broken binding",
  "Books written in by a previous owner",
  "Old editions or textbooks (case by case)",
];

const faqs = [
  {
    question: "How long does the buyback payment take?",
    answer:
      "After the book reaches us and passes inspection, we send the money via bKash, Nagad or bank transfer within 3–5 business days.",
  },
  {
    question: "Who pays for shipping the book?",
    answer:
      "Inside Dhaka our team can collect it. Outside Dhaka the reader usually covers the courier cost, but we can arrange something special for larger orders.",
  },
  {
    question: "How many books can I return at once?",
    answer:
      "You can send several books together. Separate photos and condition notes for each book speed things up. The total buyback value is capped at ৳20,000.",
  },
  {
    question: "Can I take another book of equal value instead of cash?",
    answer:
      "Yes. You can keep the buyback amount as store credit and put it toward new books. Just let us know when you get in touch.",
  },
  {
    question: "Does the demo site really pay money?",
    answer:
      "No. This website is a front-end demo; no real payment or buyback transaction takes place here. These terms will apply when the real service launches.",
  },
];

export default function BuybackPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Buyback"
        title="Finished reading? Send it back and get 50% cash"
        description="The books gathering dust on your shelf are waiting for a new reader. Return a book you bought from TalkNest and get up to 50% of the purchase price back — simple, transparent and hassle-free."
        tone="dark"
        crumbs={[{ label: "50% Book Buyback" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Up to 50% cash back
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            Initial response within 24 hours
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            A second life for books
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div key={step.title} className="relative rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                    <step.icon size={17} />
                  </span>
                  <span className="font-display text-2xl font-bold text-forest-900/15">
                    {toBn(index + 1)}
                  </span>
                </div>
                <h2 className="mt-3 text-[12px] font-semibold leading-snug text-forest-950">{step.title}</h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{step.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <div className="space-y-4">
              <div className="relative overflow-hidden rounded-3xl bg-forest-950 p-6 text-cream-50 sm:p-8">
                <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.1]" />
                <div aria-hidden="true" className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold-400/20" />
                <div aria-hidden="true" className="absolute -bottom-20 -left-12 h-48 w-48 rounded-full border border-white/10" />
                <div className="relative">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                    <Repeat2 size={11} /> Why Buyback
                  </span>
                  <h2 className="mt-3 font-display text-2xl font-bold leading-snug sm:text-[1.7rem]">
                    One book, two readers, three times the joy
                  </h2>
                  <p className="mt-2 max-w-lg text-xs leading-relaxed text-cream-100/60">
                    Finishing a book doesn't end its journey. A returned book is checked,
                    cleaned and passed on to a new reader at a friendly price. You get
                    cash, a new reader gets a beloved book — and together we waste less
                    paper.
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      { value: "50%", label: "Max cash back" },
                      { value: "3–5", label: "Days to payment" },
                      { value: "2nd", label: "Life for the book" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                        <p className="font-display text-xl font-bold text-gold-300">{stat.value}</p>
                        <p className="mt-0.5 text-[8px] text-cream-100/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" variant="gold" size="sm">
                      Apply on WhatsApp
                      <ArrowRight size={13} />
                    </Button>
                    <Button href="#calculator" variant="light" size="sm">
                      Try the calculator
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-forest-500/20 bg-forest-50/60 p-4">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
                    <CheckCircle2 size={13} className="text-forest-600" />
                    What we accept
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {accepted.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75">
                        <CheckCircle2 size={10} className="mt-0.5 shrink-0 text-forest-500" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="rounded-2xl border border-clay-500/20 bg-clay-500/5 p-4">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
                    <XCircle size={13} className="text-clay-600" />
                    What we can't accept
                  </h3>
                  <ul className="mt-2.5 space-y-1.5">
                    {notAccepted.map((item) => (
                      <li key={item} className="flex items-start gap-2 text-[10px] leading-relaxed text-forest-800/75">
                        <XCircle size={10} className="mt-0.5 shrink-0 text-clay-400" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 p-4 text-[10px] text-forest-800/70">
                <span className="flex items-center gap-1.5">
                  <Clock3 size={13} className="text-forest-600" /> Reply within 24 hours of applying
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-forest-600" /> Transparent valuation
                </span>
                <span className="flex items-center gap-1.5">
                  <Recycle size={13} className="text-forest-600" /> Books get reused
                </span>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-[88px]">
              <BuybackCalculator />
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
                  <Sparkles size={13} className="text-gold-600" /> How buyback works
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-muted">
                  The 50% is calculated on our selling price. The final amount may be
                  slightly lower depending on the book's condition, edition and demand.
                  Full details are in our{" "}
                  <Link href="/return-policy#buyback" className="font-semibold text-clay-600">
                    return policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                <HeartHandshake size={17} className="text-forest-600" /> Reader experiences
              </h2>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    name: "Sumaiya Akter",
                    text: "I returned three old books and got 50% back. The whole process took just three days!",
                  },
                  {
                    name: "Abdullah Al Mamun",
                    text: "They told me what I'd get right after I sent the photos. No hassle at all.",
                  },
                ].map((review) => (
                  <div key={review.name} className="rounded-xl bg-cream-100/60 px-3.5 py-3">
                    <p className="text-[10px] leading-relaxed text-forest-800/75">“{review.text}”</p>
                    <p className="mt-1.5 text-[9px] font-semibold text-forest-900">— {review.name}</p>
                  </div>
                ))}
              </div>
            </section>

            <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
              <h2 className="font-display text-lg font-bold text-forest-950">Common questions</h2>
              <div className="mt-3 space-y-2">
                {faqs.map((faq) => (
                  <details key={faq.question} className="group rounded-xl border border-forest-900/8 bg-cream-100/40 px-3.5 py-2.5">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[10px] font-semibold text-forest-950">
                      {faq.question}
                      <span className="text-[12px] text-clay-600 transition-transform group-open:rotate-45">+</span>
                    </summary>
                    <p className="mt-1.5 text-[9px] leading-relaxed text-muted">{faq.answer}</p>
                  </details>
                ))}
              </div>
            </section>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-clay-500 px-5 py-4 text-cream-50 sm:flex-row">
            <p className="text-center text-xs font-medium sm:text-left">
              Get in touch today to find out what your books are worth.
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/contact" variant="light" size="sm">Contact form</Button>
              <Button href="/used-books" variant="gold" size="sm">Shop used books</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
