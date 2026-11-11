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
  title: "পাইকারি অর্ডার",
  description:
    "লাইব্রেরি, স্কুল, মসজিদ, ক্লাব ও ব্যবসার জন্য TalkNest BD-এর পাইকারি বই অর্ডার — ১০ কপি থেকে বিশেষ কমিশন ও ডেডিকেটেড সাপোর্ট।",
};

const tiers = [
  {
    name: "স্টার্টার",
    quantity: "১০–২৫ কপি",
    discount: "১০%",
    delivery: "৳৬০ ফ্ল্যাট",
    highlight: false,
  },
  {
    name: "লাইব্রেরি",
    quantity: "২৬–৫০ কপি",
    discount: "১৫%",
    delivery: "ফ্রি ডেলিভারি",
    highlight: true,
  },
  {
    name: "ইনস্টিটিউশন",
    quantity: "৫১–১০০ কপি",
    discount: "২০%",
    delivery: "ফ্রি ডেলিভারি",
    highlight: false,
  },
  {
    name: "বাল্ক পার্টনার",
    quantity: "১০০+ কপি",
    discount: "কাস্টম কোটেশন",
    delivery: "ফ্রি + প্রায়োরিটি",
    highlight: false,
  },
];

const benefits = [
  {
    icon: Percent,
    title: "১০% থেকে ২০% পর্যন্ত কমিশন",
    text: "অর্ডারের পরিমাণ বাড়লে কমিশনও বাড়ে। ১০০+ কপিতে বিশেষ কাস্টম কোটেশন।",
  },
  {
    icon: Truck,
    title: "সারাদেশে ডেলিভারি",
    text: "ঢাকায় ২–৪ ও ঢাকার বাইরে ৩–৭ কর্মদিবসে পৌঁছে যাবে আপনার বইয়ের বান্ডেল।",
  },
  {
    icon: PackageCheck,
    title: "বাল্ক প্যাকেজিং",
    text: "প্রতিটি বান্ডেল আলাদা করে যাচাই ও সুরক্ষিত প্যাকেজিংয়ে পাঠানো হয়।",
  },
  {
    icon: Headphones,
    title: "ডেডিকেটেড সাপোর্ট",
    text: "পাইকারি অর্ডারের জন্য আলাদা টিম — স্টক, বিল ও ডেলিভারি সব এক জায়গায়।",
  },
];

const faqs = [
  {
    question: "পাইকারি অর্ডারে সর্বনিম্ন কত কপি লাগবে?",
    answer:
      "একক শিরোনামে কমপক্ষে ১০ কপি অর্ডার করা যায়। তবে আপনার প্রয়োজন অনুযায়ী একাধিক বই মিলিয়ে ২৫+, ৫০+ বা ১০০+ কপির প্যাকেজও নিতে পারবেন।",
  },
  {
    question: "কীভাবে পেমেন্ট করব?",
    answer:
      "ডেমো সাইটে কোনো আসল পেমেন্ট নেওয়া হয় না। বাস্তব অর্ডারে কোটেশন নিশ্চিত করার পর বিকাশ, নগদ, ব্যাংক ট্রান্সফার বা ক্যাশ অন ডেলিভারিতে পেমেন্ট করা যাবে।",
  },
  {
    question: "বইয়ের স্টক আগে থেকে নিশ্চিত করা যাবে?",
    answer:
      "হ্যাঁ। কোটেশন অনুরোধের সময় বইয়ের তালিকা ও পরিমাণ জানালে আমাদের টিম স্টক যাচাই করে লিখিতভাবে নিশ্চিত করবে।",
  },
  {
    question: "ইনভয়েস বা ভ্যাট সংক্রান্ত সহায়তা পাওয়া যাবে?",
    answer:
      "প্রতিষ্ঠানের নাম, ঠিকানা ও প্রয়োজনীয় তথ্য দিলে পাইকারি অর্ডারের জন্য আলাদা ইনভয়েস প্রস্তুত করা হবে।",
  },
  {
    question: "কত সময়ের মধ্যে কোটেশন পাব?",
    answer:
      "সাধারণত ১ কর্মদিবসের মধ্যে ফোন বা ইমেইলে কোটেশন পাঠানো হয়। জরুরি হলে হোয়াটসঅ্যাপে সরাসরি যোগাযোগ করতে পারেন।",
  },
];

export default function WholesalePage() {
  const picks = books.filter((book) => book.tags.includes("bestseller")).slice(0, 4);

  return (
    <>
      <PageHeader
        eyebrow="Wholesale Program"
        title="পাইকারি অর্ডারে আরও বই, আরও সাশ্রয়"
        description="লাইব্রেরি, স্কুল, মাদ্রাসা, মসজিদ, ক্লাব ও বইয়ের দোকানের জন্য TalkNest BD-এর পাইকারি সেবা — বিশেষ কমিশন, গোছানো ডেলিভারি আর আলাদা পার্টনার সাপোর্ট।"
        tone="dark"
        crumbs={[{ label: "পাইকারি অর্ডার" }]}
      >
        <div className="flex flex-wrap gap-2">
          {["১০ কপি থেকেই শুরু", "১০–২০% কমিশন", "সারাদেশে ডেলিভারি"].map((item) => (
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
                      পাইকারি মূল্য তালিকা
                    </h2>
                  </div>
                  <p className="mt-1 text-[10px] text-muted">
                    কমিশন বইয়ের ধরন অনুযায়ী কিছুটা কমবেশি হতে পারে; চূড়ান্ত কোটেশন
                    আবেদনের পর নিশ্চিত হবে।
                  </p>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[520px] border-collapse text-left">
                    <thead>
                      <tr className="border-b border-forest-900/8 text-[9px] uppercase tracking-[0.12em] text-muted">
                        <th className="px-5 py-3 font-semibold">প্যাকেজ</th>
                        <th className="px-3 py-3 font-semibold">পরিমাণ</th>
                        <th className="px-3 py-3 font-semibold">কমিশন</th>
                        <th className="px-5 py-3 font-semibold">ডেলিভারি</th>
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
                                  জনপ্রিয়
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
                  <span>সর্বনিম্ন অর্ডার: ১০ কপি · ডেমো মূল্য তালিকা</span>
                  <Link href="/terms" className="font-semibold text-forest-800 hover:text-clay-600">
                    শর্তাবলি দেখুন
                  </Link>
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  জনপ্রিয় পাইকারি বাছাই
                </h2>
                <p className="mt-1 text-[10px] text-muted">
                  লাইব্রেরি ও প্রতিষ্ঠানের জন্য সবচেয়ে বেশি অর্ডার হওয়া বইগুলো।
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
                        {formatPrice(book.price)} · ১০+ কপিতে বিশেষ দাম
                      </span>
                    </Link>
                  ))}
                </div>
                <Button href="/books" variant="outline" size="sm" className="mt-4">
                  পুরো ক্যাটালগ
                  <ArrowRight size={13} />
                </Button>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
                <h2 className="font-display text-lg font-bold text-forest-950">
                  কারা পাইকারি অর্ডার করতে পারেন
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { icon: LibraryBig, label: "লাইব্রেরি ও পাঠাগার" },
                    { icon: Building2, label: "স্কুল, কলেজ ও মাদ্রাসা" },
                    { icon: Store, label: "বইয়ের দোকান ও রিসেলার" },
                    { icon: Users, label: "ক্লাব, মসজিদ ও কমিউনিটি সেন্টার" },
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

            <div className="space-y-4 lg:sticky lg:top-32">
              <WholesaleForm />
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="text-[11px] font-semibold text-forest-950">দ্রুত কোটেশন চান?</p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  বইয়ের তালিকা ও পরিমাণসহ হোয়াটসঅ্যাপে মেসেজ দিন — পাইকারি টিম
                  সরাসরি সহায়তা করবে।
                </p>
                <a
                  href="https://wa.me/8801712345678?text=%E0%A6%AA%E0%A6%BE%E0%A6%87%E0%A6%95%E0%A6%BE%E0%A6%B0%E0%A6%BF%20%E0%A6%85%E0%A6%B0%E0%A7%8D%E0%A6%A1%E0%A6%BE%E0%A6%B0%20%E0%A6%95%E0%A7%8B%E0%A6%9F%E0%A7%87%E0%A6%B6%E0%A6%A8"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2.5 inline-flex h-8 items-center rounded-full bg-forest-900 px-3.5 text-[9px] font-semibold text-cream-50 hover:bg-forest-700"
                >
                  হোয়াটসঅ্যাপে যোগাযোগ
                </a>
              </div>
            </div>
          </div>

          <section className="mt-8 rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={17} className="text-forest-600" />
              <h2 className="font-display text-lg font-bold text-forest-950">সাধারণ জিজ্ঞাসা</h2>
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
              প্রতিষ্ঠানের জন্য বিশেষ প্যাকেজ দরকার? {toBn(10)}+ কপি থেকে শুরু হোক।
            </p>
            <Button href="/contact" variant="gold" size="sm">
              সরাসরি কথা বলুন
              <ArrowRight size={13} />
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
