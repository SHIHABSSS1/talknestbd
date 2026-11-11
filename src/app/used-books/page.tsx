import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  BookHeart,
  CheckCircle2,
  HandCoins,
  MapPin,
  MessagesSquare,
  Recycle,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { UsedBookSellForm, UsedBooksMarket } from "@/components/used-books/UsedBooksMarket";
import { Button } from "@/components/ui/Button";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "পুরাতন বই (৫০% আপ)",
  description:
    "পাঠক থেকে পাঠকের কাছে পুরাতন বই কিনুন অর্ধেক দামে, অথবা নিজের পড়া শেষ হওয়া বই বিক্রি করুন — TalkNest BD পুরাতন বই মার্কেট।",
};

const steps = [
  {
    icon: BookHeart,
    title: "বই খুঁজুন",
    text: "কন্ডিশন ও এলাকা দেখে পছন্দের পুরাতন বই বেছে নিন। প্রতিটি বইয়ের অবস্থা যাচাই করা।",
  },
  {
    icon: MessagesSquare,
    title: "বিক্রেতার সঙ্গে কথা বলুন",
    text: "বইটি সম্পর্কে প্রশ্ন করুন, ছবি দেখুন এবং কিনতে চাইলে যোগাযোগ করুন।",
  },
  {
    icon: Truck,
    title: "নিরাপদে বই পান",
    text: "ঢাকায় হাতে হাতে, বাইরে কুরিয়ারে। পেমেন্টের আগে বইয়ের অবস্থা মিলিয়ে নিন।",
  },
];

export default function UsedBooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="Used Book Marketplace"
        title="পুরাতন বই, নতুন খুশি"
        description="পাঠক থেকে পাঠকের কাছে বইয়ের যাত্রা। পড়া শেষ হওয়া বই বিক্রি করুন, আবার অর্ধেক দামে কিনে নিন অন্য পাঠকের প্রিয় বই।"
        tone="dark"
        crumbs={[{ label: "পুরাতন বই" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            ৫০% পর্যন্ত সাশ্রয়
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            যাচাই করা কন্ডিশন
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            বইয়ের দ্বিতীয় জীবন
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="mb-7 grid gap-3 overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50 sm:grid-cols-[1.2fr_0.8fr]">
            <div className="p-5 sm:p-7">
              <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-600">
                <Recycle size={13} /> বইয়ের দ্বিতীয় জীবন
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl">
                একটি বই যত হাত ঘুরবে, তত বেশি জীবন পাবে
              </h2>
              <p className="mt-2 max-w-lg text-xs leading-relaxed text-muted sm:text-[13px]">
                পুরনো বই মানে পুরনো গল্প নয় — বরং নতুন পাঠকের জন্য অপেক্ষা করা
                অমূল্য গল্প। TalkNest-এর পুরাতন বই মার্কেটে বই বিক্রি করুন বা
                কিনুন, দুটোই সহজ।
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href="#market" size="sm">
                  বই দেখুন
                  <ArrowRight size={13} />
                </Button>
                <Button href="#sell" variant="outline" size="sm">
                  বই বিক্রি করুন
                </Button>
              </div>
            </div>
            <div className="relative min-h-[160px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1000&q=80"
                alt="পুরনো বইয়ের সংগ্রহ"
                className="absolute inset-0 h-full w-full object-cover"
                loading="lazy"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-forest-950/25 to-transparent" />
              <span className="absolute bottom-4 left-4 rounded-full bg-cream-50/90 px-3 py-1.5 text-[9px] font-semibold text-forest-900 backdrop-blur">
                {toBn(50)}% আপ · পাঠক-থেকে-পাঠক
              </span>
            </div>
          </div>

          <div id="market" className="scroll-mt-32">
            <UsedBooksMarket />
          </div>

          <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
            <div className="space-y-4">
              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <div className="flex items-center gap-2">
                  <Sparkles size={17} className="text-clay-600" />
                  <h2 className="font-display text-lg font-bold text-forest-950">কীভাবে কাজ করে</h2>
                </div>
                <div className="mt-4 space-y-3">
                  {steps.map((step, index) => (
                    <div key={step.title} className="flex items-start gap-3">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                        <step.icon size={16} />
                      </span>
                      <div className="border-b border-forest-900/6 pb-3 last:border-b-0 last:pb-0">
                        <p className="text-[11px] font-semibold text-forest-950">
                          {toBn(index + 1)}. {step.title}
                        </p>
                        <p className="mt-0.5 text-[10px] leading-relaxed text-muted">{step.text}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                  <ShieldCheck size={17} className="text-forest-600" /> নিরাপদ লেনদেনের নিয়ম
                </h2>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { icon: BadgeCheck, text: "প্রতিটি বইয়ের কন্ডিশন যাচাই করা" },
                    { icon: MapPin, text: "এলাকা দেখে সরাসরি দেখে কেনার সুযোগ" },
                    { icon: HandCoins, text: "পেমেন্টের আগে বই মিলিয়ে নিন" },
                    { icon: CheckCircle2, text: "ভুল বর্ণনা হলে সহায়তা" },
                  ].map((item) => (
                    <div key={item.text} className="flex items-start gap-2 rounded-xl bg-cream-100/60 px-3 py-2.5">
                      <item.icon size={13} className="mt-0.5 shrink-0 text-forest-600" />
                      <span className="text-[10px] leading-relaxed text-forest-800/80">{item.text}</span>
                    </div>
                  ))}
                </div>
                <p className="mt-3 rounded-xl border border-dashed border-forest-900/15 px-3 py-2 text-[9px] leading-relaxed text-muted">
                  ডেমো মার্কেটপ্লেসে কোনো আসল পেমেন্ট হয় না। বাস্তব লেনদেনের আগে
                  বিক্রেতা ও বইয়ের তথ্য ভালোভাবে যাচাই করুন।
                </p>
              </section>

              <div className="rounded-2xl bg-forest-950 p-5 text-cream-50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-gold-400">
                  বাইব্যাক vs পুরাতন বই
                </p>
                <p className="mt-1.5 text-xs leading-relaxed text-cream-100/60">
                  TalkNest থেকে কেনা বই ফেরত দিলে ৫০% ক্যাশ পান। অন্য পাঠকের কাছে
                  সরাসরি বিক্রি করতে চাইলে পুরাতন বই মার্কেটে তালিকা দিন।
                </p>
                <Link
                  href="/buyback"
                  className="mt-2 inline-flex items-center gap-1 text-[10px] font-semibold text-gold-300 hover:text-gold-400"
                >
                  বাইব্যাক সম্পর্কে জানুন
                  <ArrowRight size={11} />
                </Link>
              </div>
            </div>

            <div id="sell" className="scroll-mt-32 lg:sticky lg:top-32">
              <UsedBookSellForm />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
