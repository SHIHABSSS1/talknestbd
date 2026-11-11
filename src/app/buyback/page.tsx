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
  title: "৫০% বই ফেরত (বাইব্যাক)",
  description:
    "TalkNest BD থেকে কেনা বই পড়া শেষে ফেরত দিন, পান কেনা মূল্যের ৫০% পর্যন্ত ক্যাশ। সহজ বাইব্যাক প্রক্রিয়া ও ক্যালকুলেটর।",
};

const steps = [
  {
    icon: BookOpenCheck,
    title: "বইটি পড়ে শেষ করুন",
    text: "TalkNest BD থেকে কেনা যেকোনো বই ভালোবাসায় পড়ুন এবং যত্নে রাখুন।",
  },
  {
    icon: Package,
    title: "ছবি ও অর্ডার নম্বর পাঠান",
    text: "বইয়ের সামনের-পেছনের ছবি, বাঁধাই ও অর্ডার নম্বর হোয়াটসঅ্যাপে পাঠান।",
  },
  {
    icon: ShieldCheck,
    title: "যাচাই ও প্রস্তাব",
    text: "আমাদের টিম বইয়ের অবস্থা দেখে চূড়ান্ত বাইব্যাক মূল্য নিশ্চিত করবে।",
  },
  {
    icon: Banknote,
    title: "৫০% ক্যাশ ফেরত",
    text: "বই আমাদের কাছে পৌঁছালে ৩–৫ কর্মদিবসের মধ্যে বিকাশ/নগদে টাকা পান।",
  },
];

const accepted = [
  "TalkNest BD থেকে কেনা বই",
  "পাতা, বাঁধাই ও কভার অক্ষত",
  "স্বাভাবিক ব্যবহারের সামান্য ছাপ থাকতে পারে",
  "অর্ডার নম্বর বা ক্রয়ের প্রমাণ আছে",
];

const notAccepted = [
  "পানি, তেল বা কালিতে ভেজা বই",
  "ছেঁড়া পাতা বা ভাঙা বাঁধাই",
  "কেউ নিজে লিখে ফেলেছেন এমন বই",
  "পুরনো সংস্করণ বা পাঠ্যপুস্তক (শর্তসাপেক্ষ)",
];

const faqs = [
  {
    question: "বাইব্যাকের টাকা কত দিনে পাব?",
    answer:
      "বই আমাদের কাছে পৌঁছে যাচাই সম্পন্ন হওয়ার পর ৩–৫ কর্মদিবসের মধ্যে বিকাশ, নগদ বা ব্যাংকে টাকা পাঠানো হয়।",
  },
  {
    question: "বই পাঠানোর খরচ কে দেবে?",
    answer:
      "ঢাকার ভেতরে আমাদের টিম সংগ্রহ করতে পারে। ঢাকার বাইরে থেকে কুরিয়ার খরচ সাধারণত পাঠক বহন করেন, তবে বড় অর্ডারে বিশেষ ব্যবস্থা করা যায়।",
  },
  {
    question: "একসঙ্গে কয়টি বই ফেরত দিতে পারব?",
    answer:
      "একসঙ্গে একাধিক বই দেওয়া যায়। প্রতিটি বইয়ের আলাদা ছবি ও অবস্থা জানালে দ্রুত প্রক্রিয়া হয়। তবে মোট বাইব্যাক মূল্য সর্বোচ্চ ৳২০,০০০।",
  },
  {
    question: "বই ফেরত না দিয়ে কি সমান দামে অন্য বই নেওয়া যাবে?",
    answer:
      "হ্যাঁ, বাইব্যাকের টাকা টক-টাইম ক্রেডিট হিসেবে রেখে নতুন বই কিনতে পারেন। যোগাযোগের সময় এটি জানিয়ে দিলে সুবিধা হবে।",
  },
  {
    question: "ডেমো সাইটে কি সত্যিই টাকা পাওয়া যাবে?",
    answer:
      "না। এই ওয়েবসাইটটি একটি ফ্রন্টএন্ড ডেমো; এখানে কোনো আসল পেমেন্ট বা বাইব্যাক লেনদেন হয় না। বাস্তব সেবা চালু হলে এই নিয়ম প্রযোজ্য হবে।",
  },
];

export default function BuybackPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Buyback"
        title="পড়া শেষ? বই ফেরত দিন, পান ৫০% ক্যাশ"
        description="আপনার আলমারি ধুলো জমা বইয়েরা অপেক্ষা করছে নতুন পাঠকের জন্য। TalkNest থেকে কেনা বই ফেরত দিলে কেনা মূল্যের ৫০% পর্যন্ত ফেরত পান — সহজ, স্বচ্ছ, ঝামেলাহীন।"
        tone="dark"
        crumbs={[{ label: "৫০% বই ফেরত" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            সর্বোচ্চ ৫০% ক্যাশ ফেরত
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            ২৪ ঘণ্টায় প্রাথমিক সাড়া
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            বইয়ের দ্বিতীয় জীবন
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
                    একটি বই, দুজনের পড়া — তিনজনের আনন্দ
                  </h2>
                  <p className="mt-2 max-w-lg text-xs leading-relaxed text-cream-100/60">
                    বই পড়া শেষ মানে বইয়ের যাত্রা শেষ নয়। ফেরত দেওয়া বই আবার যাচাই,
                    পরিষ্কার ও সাশ্রয়ী দামে নতুন পাঠকের হাতে পৌঁছে যায়। আপনি পান
                    ক্যাশ, নতুন পাঠক পান প্রিয় বই — আর আমরা একসঙ্গে কমাই কাগজের অপচয়।
                  </p>
                  <div className="mt-4 grid grid-cols-3 gap-2 text-center">
                    {[
                      { value: "৫০%", label: "সর্বোচ্চ ক্যাশ" },
                      { value: "৩–৫", label: "কর্মদিবসে পেমেন্ট" },
                      { value: "২রা", label: "বইয়ের নতুন জীবন" },
                    ].map((stat) => (
                      <div key={stat.label} className="rounded-xl border border-white/10 bg-white/5 px-2 py-3">
                        <p className="font-display text-xl font-bold text-gold-300">{stat.value}</p>
                        <p className="mt-0.5 text-[8px] text-cream-100/50">{stat.label}</p>
                      </div>
                    ))}
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    <Button href={siteConfig.whatsapp} target="_blank" rel="noopener noreferrer" variant="gold" size="sm">
                      হোয়াটসঅ্যাপে আবেদন
                      <ArrowRight size={13} />
                    </Button>
                    <Button href="#calculator" variant="light" size="sm">
                      ক্যালকুলেটর দেখুন
                    </Button>
                  </div>
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-forest-500/20 bg-forest-50/60 p-4">
                  <h3 className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
                    <CheckCircle2 size={13} className="text-forest-600" />
                    কোন বই গ্রহণযোগ্য
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
                    কোন বই নেওয়া হয় না
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
                  <Clock3 size={13} className="text-forest-600" /> আবেদনের ২৪ ঘণ্টায় উত্তর
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck size={13} className="text-forest-600" /> স্বচ্ছ মূল্য যাচাই
                </span>
                <span className="flex items-center gap-1.5">
                  <Recycle size={13} className="text-forest-600" /> বইয়ের পুনর্ব্যবহার
                </span>
              </div>
            </div>

            <div className="space-y-4 lg:sticky lg:top-32">
              <BuybackCalculator />
              <div className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
                  <Sparkles size={13} className="text-gold-600" /> বাইব্যাক বুঝে নিন
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-muted">
                  ৫০% হিসাব হয় আমাদের বিক্রয়মূল্যের উপর। বইয়ের অবস্থা, সংস্করণ ও
                  চাহিদা অনুযায়ী চূড়ান্ত পরিমাণ কিছুটা কমতে পারে। বিস্তারিত{" "}
                  <Link href="/return-policy#buyback" className="font-semibold text-clay-600">
                    রিটার্ন পলিসিতে
                  </Link>{" "}
                  আছে।
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 grid gap-4 sm:grid-cols-2">
            <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5">
              <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                <HeartHandshake size={17} className="text-forest-600" /> পাঠকদের অভিজ্ঞতা
              </h2>
              <div className="mt-3 space-y-2.5">
                {[
                  {
                    name: "সুমাইয়া আক্তার",
                    text: "তিনটি পুরনো বই ফেরত দিয়ে ৫০% টাকা পেয়েছি। প্রক্রিয়াটা মাত্র তিন দিনে শেষ!",
                  },
                  {
                    name: "আব্দুল্লাহ আল মামুন",
                    text: "বইয়ের ছবি পাঠানোর পরই জানিয়ে দিয়েছে কত পাব। কোনো ঝামেলা হয়নি।",
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
              <h2 className="font-display text-lg font-bold text-forest-950">সাধারণ জিজ্ঞাসা</h2>
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
              আপনার বইয়ের বাইব্যাক মূল্য জানতে আজই যোগাযোগ করুন।
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/contact" variant="light" size="sm">যোগাযোগ ফর্ম</Button>
              <Button href="/used-books" variant="gold" size="sm">পুরাতন বই কিনুন</Button>
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
