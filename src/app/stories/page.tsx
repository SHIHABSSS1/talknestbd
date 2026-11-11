import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  FileText,
  Heart,
  Mic,
  PenLine,
  ShieldCheck,
  Sparkles,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { StoriesWall } from "@/components/stories/StoriesWall";
import { Button } from "@/components/ui/Button";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "হৃদয়ের গল্প",
  description:
    "TalkNest পাঠকদের নিজের গল্প — ভয়েস, লেখা ও PDF ডায়েরিতে শেয়ার করা স্মৃতি, অনুভূতি আর জীবনের ছোট বড় মুহূর্ত।",
};

const stats = [
  { icon: PenLine, value: "২১০+", label: "শেয়ার করা গল্প" },
  { icon: Mic, value: "৮৪", label: "ভয়েস স্টোরি" },
  { icon: Users, value: "১২ হাজার", label: "পাঠক পরিবার" },
];

export default function StoriesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Share to My Heart"
        title="আপনার গল্প, সবার হৃদয়ে"
        description="জীবনের ছোট ছোট গল্প, স্মৃতি আর অনুভূতি শেয়ার করুন — লিখে, নিজের কণ্ঠে রেকর্ড করে বা PDF ডায়েরি আপলোড করে। এখানে প্রতিটি গল্পের মূল্য আছে।"
        tone="dark"
        crumbs={[{ label: "হৃদয়ের গল্প" }]}
      >
        <div className="flex flex-wrap gap-2">
          <Button href="/stories/share" variant="gold" size="sm">
            <Mic size={13} /> গল্প শেয়ার করুন
          </Button>
          <Button href="#stories" variant="light" size="sm">
            সব গল্প পড়ুন
          </Button>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-3">
            {stats.map((stat) => (
              <div key={stat.label} className="flex items-center gap-3 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3.5">
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <stat.icon size={17} />
                </span>
                <div>
                  <p className="font-display text-xl font-bold text-forest-950">{stat.value}</p>
                  <p className="text-[9px] text-muted">{stat.label}</p>
                </div>
              </div>
            ))}
          </div>

          <div id="stories" className="mt-7 scroll-mt-32">
            <StoriesWall />
          </div>

          <div className="mt-9 grid gap-4 lg:grid-cols-[1.3fr_0.7fr]">
            <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
              <div className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-forest-600" />
                <h2 className="font-display text-lg font-bold text-forest-950">
                  গল্প শেয়ারের সহজ নিয়ম
                </h2>
              </div>
              <div className="mt-3 grid gap-2 sm:grid-cols-2">
                {[
                  "গল্পটি আপনার নিজের অভিজ্ঞতা বা সম্পূর্ণ কল্পনা হতে হবে",
                  "অন্যের ব্যক্তিগত তথ্য বা ছবি অনুমতি ছাড়া দেবেন না",
                  "অপমান, বিদ্বেষ বা রাজনৈতিক বিতর্ক এড়িয়ে চলুন",
                  "ভয়েস রেকর্ডিং ৫ মিনিটের মধ্যে রাখলে ভালো",
                  "PDF হলে লেখা পরিষ্কার ও পাঠযোগ্য হতে হবে",
                  "প্রকাশের আগে সম্পাদকীয় টিম রিভিউ করবে",
                ].map((item) => (
                  <div key={item} className="flex items-start gap-2 rounded-xl bg-cream-100/60 px-3 py-2.5">
                    <Heart size={11} className="mt-0.5 shrink-0 fill-clay-500/20 text-clay-500" />
                    <span className="text-[10px] leading-relaxed text-forest-800/80">{item}</span>
                  </div>
                ))}
              </div>
            </section>

            <section className="relative overflow-hidden rounded-3xl bg-clay-500 p-5 text-cream-50 sm:p-6">
              <div aria-hidden="true" className="absolute -right-10 -top-12 h-36 w-36 rounded-full border border-white/15" />
              <Sparkles size={20} className="text-cream-100/80" />
              <h2 className="mt-2 font-display text-xl font-bold leading-snug">
                একটি গল্প শেয়ার করুন, কারও দিনটা বদলে দিন
              </h2>
              <p className="mt-1.5 text-[10px] leading-relaxed text-cream-100/70">
                আপনার লেখা, কণ্ঠ বা ডায়েরি হয়তো আজ অন্য একজন পাঠকের সবচেয়ে
                প্রয়োজনীয় সাহস হয়ে উঠবে।
              </p>
              <Link
                href="/stories/share"
                className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-cream-50 px-4 text-[10px] font-semibold text-clay-600 hover:bg-cream-100"
              >
                গল্প শুরু করুন
                <ArrowRight size={12} />
              </Link>
              <div className="mt-4 flex items-center gap-2 text-[9px] text-cream-100/60">
                <FileText size={11} /> ভয়েস · লেখা · PDF
              </div>
            </section>
          </div>

          <p className="mt-5 text-center text-[9px] text-muted">
            এ মাসে {toBn(210)}টি গল্প শেয়ার হয়েছে · প্রতিটি গল্প পাঠকের নিজস্ব
          </p>
        </Container>
      </section>
    </>
  );
}
