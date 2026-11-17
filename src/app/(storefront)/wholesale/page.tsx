import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgePercent,
  Building2,
  CheckCircle2,
  Headphones,
  LibraryBig,
  PackageCheck,
  Percent,
  Store,
  Truck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { WholesaleForm } from "@/components/services/WholesaleForm";
import { Button } from "@/components/ui/Button";
import { BookCover } from "@/components/books/BookCover";
import { books } from "@/data/books";
import { formatPrice, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Wholesale Orders",
  description:
    "Wholesale book orders from TalkNest BD for libraries, schools, mosques, clubs and businesses — special commissions from 10 copies and dedicated support.",
};

const tiers = [
  {
    name: "Starter",
    quantity: "10–25 copies",
    discount: "10%",
    delivery: "৳60 flat",
    highlight: false,
  },
  {
    name: "Library",
    quantity: "26–50 copies",
    discount: "15%",
    delivery: "Free delivery",
    highlight: true,
  },
  {
    name: "Institution",
    quantity: "51–100 copies",
    discount: "20%",
    delivery: "Free delivery",
    highlight: false,
  },
  {
    name: "Bulk Partner",
    quantity: "100+ copies",
    discount: "Custom quote",
    delivery: "Free + priority",
    highlight: false,
  },
];

const benefits = [
  {
    icon: Percent,
    title: "10% to 20% commission",
    text: "The more copies you order, the bigger the discount. Custom quotes for 100+ copies.",
  },
  {
    icon: Truck,
    title: "Nationwide delivery",
    text: "Your book bundles arrive in 2–4 days in Dhaka and 3–7 business days outside Dhaka.",
  },
  {
    icon: PackageCheck,
    title: "Bulk packaging",
    text: "Every bundle is checked individually and packed securely before it ships.",
  },
  {
    icon: Headphones,
    title: "Dedicated support",
    text: "A separate team for wholesale orders — stock, invoicing and delivery in one place.",
  },
];

const faqs = [
  {
    question: "What is the minimum order for wholesale?",
    answer:
      "You can order as few as 10 copies of a single title. You can also mix titles to build 25+, 50+ or 100+ copy packages to suit your needs.",
  },
  {
    question: "How do I pay?",
    answer:
      "No real payment is taken on this demo site. On real orders, you can pay via bKash, Nagad, bank transfer or cash on delivery once the quote is confirmed.",
  },
  {
    question: "Can you confirm stock in advance?",
    answer:
      "Yes. Share your book list and quantities when you request a quote, and our team will verify stock and confirm in writing.",
  },
  {
    question: "Can you help with invoices or VAT?",
    answer:
      "Give us your organisation's name, address and the details you need, and we will prepare a separate invoice for your wholesale order.",
  },
  {
    question: "How soon will I get a quote?",
    answer:
      "Usually within 1 business day by phone or email. If it is urgent, message us directly on WhatsApp.",
  },
];

export default function WholesalePage() {
  const picks = books.filter((book) => book.tags.includes("bestseller")).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Wholesale Program"
        title="Wholesale orders: more books, more savings"
        description="TalkNest BD's wholesale service for libraries, schools, madrasas, mosques, clubs and bookshops — special commissions, careful delivery and dedicated partner support."
        tone="dark"
        crumbs={[{ label: "Wholesale Orders" }]}
      >
        <div className="flex flex-wrap gap-2">
          {["From 10 copies", "10–20% commission", "Nationwide delivery"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] font-medium text-cream-100/80"
            >
              {item}
            </span>
          ))}
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit) => (
              <div
                key={benefit.title}
                className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4"
              >
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <benefit.icon size={17} />
                </span>
                <h2 className="mt-3 text-[12px] font-semibold leading-snug text-forest-950">
                  {benefit.title}
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">{benefit.text}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 grid gap-6 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-5">
              <section className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
                <div className="border-b border-forest-900/8 bg-cream-100/50 px-5 py-4">
                  <div className="flex items-center gap-2">
                    <BadgePercent size={17} className="text-clay-600" />
                    <h2 className="font-display text-lg font-bold text-forest-950">
                      Wholesale price list
                    </h2>
                  </div>
                  <p className="mt-1 text-[10px] text-muted">
                    Commission varies slightly by book type; the final quote is confirmed
                    after your request.
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-forest-900/8 text-[9px] uppercase tracking-[0.12em] text-muted">
                        <th className="px-5 py-3 font-semibold">Package</th>
                        <th className="px-3 py-3 font-semibold">Quantity</th>
                        <th className="px-3 py-3 font-semibold">Commission</th>
                        <th className="px-5 py-3 font-semibold">Delivery</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tiers.map((tier) => (
                        <tr
                          key={tier.name}
                          className={
                            tier.highlight
                              ? "border-b border-forest-900/8 bg-gold-500/8 last:border-b-0"
                              : "border-b border-forest-900/8 last:border-b-0"
                          }
                        >
                          <td className="px-5 py-3.5">
                            <span className="flex items-center gap-2 text-[11px] font-semibold text-forest-950">
                              {tier.name}
                              {tier.highlight && (
                                <span className="rounded-full bg-gold-500 px-1.5 py-0.5 text-[7px] font-bold text-forest-950">
                                  Popular
                                </span>
                              )}
                            </span>
                          </td>
                          <td className="px-3 py-3.5 text-[11px] text-forest-800">{tier.quantity}</td>
                          <td className="px-3 py-3.5 text-[11px] font-semibold text-clay-600">{tier.discount}</td>
                          <td className="px-5 py-3.5 text-[11px] text-forest-800">{tier.delivery}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 bg-cream-100/40 px-5 py-3 text-[9px] text-muted">
                  <span>Minimum order: 10 copies · Demo price list</span>
                  <Link href="/terms" className="font-semibold text-forest-800 hover:text-clay-600">
                    View terms
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  Popular wholesale picks
                </h2>
                <p className="mt-1 text-[10px] text-muted">
                  The titles libraries and institutions order most.
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {picks.map((book) => (
                    <Link key={book.slug} href={`/books/${book.slug}`} className="group">
                      <span className="block aspect-[3/4] overflow-hidden rounded-lg bg-cream-100 p-1.5 transition-transform group-hover:-translate-y-0.5">
                        <BookCover book={book} size="sm" />
                      </span>
                      <span className="mt-1.5 block line-clamp-1 text-[10px] font-semibold text-forest-900">
                        {book.title}
                      </span>
                      <span className="block text-[9px] text-muted">
                        {formatPrice(book.price)} · Special price on 10+ copies
                      </span>
                    </Link>
                  ))}
                </div>
                <Button href="/books" variant="outline" size="sm" className="mt-4">
                  Full catalogue
                  <ArrowRight size={13} />
                </Button>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  Who can place a wholesale order
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { icon: LibraryBig, label: "Libraries and reading centres" },
                    { icon: Building2, label: "Schools, colleges and madrasas" },
                    { icon: Store, label: "Bookshops and resellers" },
                    { icon: Users, label: "Clubs, mosques and community centres" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-2.5 rounded-xl bg-cream-100/60 px-3 py-2.5">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-forest-100 text-forest-700">
                        <item.icon size={14} />
                      </span>
                      <span className="text-[11px] font-medium text-forest-900">{item.label}</span>
                    </div>
                  ))}
                </div>
              </section>
            </div>

            <div className="space-y-4 lg:sticky lg:top-[88px]">
              <WholesaleForm />
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="text-[11px] font-semibold text-forest-950">Need a quote fast?</p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  Message us on WhatsApp with your book list and quantities — the
                  wholesale team will help you directly.
                </p>
                <a
                  href="https://wa.me/8801712345678?text=%E0%A6%AA%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A7%8B%E0%A6%9F%E0%A7%87%E0%A6%B6%E0%A6%A8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex h-8 items-center rounded-full bg-forest-900 px-3.5 text-[9px] font-semibold text-cream-50 hover:bg-forest-700"
                >
                  Contact on WhatsApp
                </a>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-forest-600" />
              <h2 className="font-display text-lg font-bold text-forest-950">Common questions</h2>
            </div>
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {faqs.map((faq) => (
                <details
                  key={faq.question}
                  className="group rounded-xl border border-forest-900/8 bg-cream-100/40 px-4 py-3"
                >
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-3 text-[11px] font-semibold text-forest-950">
                    {faq.question}
                    <span className="text-[13px] text-clay-600 transition-transform group-open:rotate-45">+</span>
                  </summary>
                  <p className="mt-2 text-[10px] leading-relaxed text-muted">{faq.answer}</p>
                </details>
              ))}
            </div>
          </section>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-forest-950 px-5 py-4 text-cream-50 sm:flex-row">
            <p className="text-center text-xs text-cream-100/60 sm:text-left">
              Need a special package for your organisation? Start from {toBn(10)}+ copies.
            </p>
            <Button href="/contact" variant="gold" size="sm">
              Talk to us
              <ArrowRight size={13} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
