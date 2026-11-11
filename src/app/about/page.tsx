import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  BookHeart,
  BookOpen,
  Building2,
  Clock3,
  Compass,
  HeartHandshake,
  Leaf,
  LibraryBig,
  Mail,
  MapPin,
  Mic,
  PenLine,
  Phone,
  ShieldCheck,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";
import { SocialLinks } from "@/components/layout/SocialLinks";
import { siteConfig, toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "আমাদের সম্পর্কে",
  description:
    "TalkNest BD — বাংলাদেশের পাঠকদের জন্য বই, অডিও, গল্প ও কমিউনিটির একটি উষ্ণ নীড়। আমাদের গল্প, লক্ষ্য ও যাত্রা।",
};

const stats = [
  { value: "২০ হাজার+", label: "সন্তুষ্ট পাঠক" },
  { value: "১,২০০+", label: "বইয়ের সংগ্রহ" },
  { value: "৮৪", label: "অডিও স্টোরি" },
  { value: "৬৪", label: "জেলায় ডেলিভারি" },
];

const values = [
  {
    icon: BookOpen,
    title: "ভালো বই সহজলভ্য হোক",
    text: "বাছাই করা বই, সৎ পর্যালোচনা আর সাশ্রয়ী দামে পাঠকের হাতে পৌঁছে দেওয়াই আমাদের প্রথম কাজ।",
  },
  {
    icon: HeartHandshake,
    title: "পাঠকই আমাদের পরিবার",
    text: "রিভিউ, গল্প, কুইজ আর আড্ডায় পাঠকরা আমাদের সঙ্গে যুক্ত। তাদের ভালোবাসাই আমাদের শক্তি।",
  },
  {
    icon: Leaf,
    title: "বইয়ের দ্বিতীয় জীবন",
    text: "বাইব্যাক ও পুরাতন বই মার্কেটে বই ঘুরে যায় নতুন পাঠকের কাছে — কমে কাগজের অপচয়।",
  },
  {
    icon: ShieldCheck,
    title: "স্বচ্ছতা ও ভরসা",
    text: "১০০% অরিজিনাল বই, স্পষ্ট দাম, সময়মতো ডেলিভারি আর সহজ রিটার্ন — কোনো লুকোচুরি নেই।",
  },
];

const milestones = [
  {
    year: "২০২২",
    title: "একটি ছোট্ট পাঠচক্র দিয়ে শুরু",
    text: "বন্ধুদের মধ্যে বই বিনিময় আর আলোচনা থেকে TalkNest-এর প্রথম ভাবনা।",
  },
  {
    year: "২০২৩",
    title: "অনলাইন সংগ্রহ চালু",
    text: "প্রথম ২০০ বই নিয়ে ওয়েবসাইটের যাত্রা, ঢাকার ভেতরে ডেলিভারি শুরু।",
  },
  {
    year: "২০২৪",
    title: "অডিও ও কমিউনিটি",
    text: "অডিও বুক, পাঠকের গল্প ও লেখক সাক্ষাৎকার যোগ হয়ে সমৃদ্ধ হয় প্ল্যাটফর্ম।",
  },
  {
    year: "২০২৫",
    title: "৫০% বাইব্যাক ও পাইকারি সেবা",
    text: "বইয়ের চক্র সম্পূর্ণ করতে বাইব্যাক, পুরাতন বই মার্কেট ও প্রতিষ্ঠানিক অর্ডার চালু।",
  },
  {
    year: "২০২৬",
    title: "সারাদেশে পাঠকের নীড়",
    text: "৬৪ জেলায় ডেলিভারি, হাজারো পাঠক ও নতুন নতুন গল্পের সঙ্গে পথচলা।",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Our Story"
        title="বই, গল্প আর মানুষের এক উষ্ণ নীড়"
        description="TalkNest BD শুরু হয়েছিল একটি সরল বিশ্বাস থেকে — ভালো বই সবার কাছে পৌঁছানো উচিত, আর সেই যাত্রায় পাঠক একা নয়। আজ আমরা সেই বিশ্বাসকে সারাদেশে ছড়িয়ে দিচ্ছি।"
        tone="dark"
        crumbs={[{ label: "আমাদের সম্পর্কে" }]}
      >
        <div className="flex flex-wrap gap-2">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            প্রতিষ্ঠিত ২০২২
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            ঢাকা, বাংলাদেশ
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-[10px] text-cream-100/80">
            পাঠক-প্রথম প্ল্যাটফর্ম
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
            <div className="overflow-hidden rounded-[2rem] border border-forest-900/8 bg-cream-100">
              <div className="aspect-[16/11] w-full">
                <img
                  src="https://images.unsplash.com/photo-1524995997946-a1c2e315a42f?auto=format&fit=crop&w=1400&q=80"
                  alt="TalkNest বইয়ের সংগ্রহ"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
            <div>
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                <span className="h-px w-5 bg-clay-500/50" /> Why TalkNest
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl lg:text-[2.2rem]">
                একটি বই হাতে নেওয়া মানে
                <span className="text-clay-600"> একটি নতুন দুনিয়ায় পা রাখা</span>
              </h2>
              <p className="mt-3 text-[13px] leading-relaxed text-forest-900/70">
                আমরা বিশ্বাস করি, বই শুধু পাঠ্যবস্তু নয় — এটি সাহস, সান্ত্বনা আর
                সম্ভাবনার উৎস। কিন্তু ভালো বই খুঁজে পাওয়া, সঠিক দামে কেনা আর
                ঘরে পৌঁছানো অনেকের জন্য সহজ নয়। TalkNest সেই দূরত্ব কমাতে চায়।
              </p>
              <p className="mt-2 text-[13px] leading-relaxed text-forest-900/70">
                বাংলা সাহিত্য, ইসলামিক ইতিহাস, বিশ্বসাহিত্যের অনুবাদ, শিক্ষার্থীদের
                বই আর অডিও — সব এক ছাদের নিচে। সঙ্গে পাঠকের নিজের গল্প বলার জায়গা,
                বই ফেরত দেওয়ার সুবিধা আর লেখক-প্রকাশকের সঙ্গে সরাসরি যোগ।
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button href="/books" size="sm">
                  বই ঘুরে দেখুন <ArrowRight size={13} />
                </Button>
                <Button href="/contact" variant="outline" size="sm">
                  যোগাযোগ করুন
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-7 grid grid-cols-2 gap-2.5 sm:grid-cols-4">
            {stats.map((stat) => (
              <div key={stat.label} className="rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-4 text-center">
                <p className="font-display text-2xl font-bold text-forest-950 sm:text-3xl">{stat.value}</p>
                <p className="mt-0.5 text-[9px] text-muted">{stat.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-9">
            <div className="text-center">
              <span className="inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-500">
                <span className="h-px w-5 bg-clay-500/50" /> Our Values
              </span>
              <h2 className="mt-1.5 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
                আমরা যা বিশ্বাস করি
              </h2>
            </div>
            <div className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {values.map((value) => (
                <div key={value.title} className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
                  <span className="grid h-11 w-11 place-items-center rounded-2xl bg-forest-100 text-forest-700">
                    <value.icon size={18} />
                  </span>
                  <h3 className="mt-3 font-display text-sm font-bold leading-snug text-forest-950">{value.title}</h3>
                  <p className="mt-1.5 text-[10px] leading-relaxed text-muted">{value.text}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-9 grid gap-5 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
            <section className="rounded-3xl bg-forest-950 p-6 text-cream-50 sm:p-7">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-gold-400/25 bg-gold-500/10 px-3 py-1 text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-300">
                <Compass size={11} /> Our Journey
              </span>
              <h2 className="mt-3 font-display text-2xl font-bold leading-snug">
                ছোট্ট পাঠচক্র থেকে সারাদেশের নীড়
              </h2>
              <p className="mt-2 text-xs leading-relaxed text-cream-100/55">
                পাঁচ বছরের যাত্রায় প্রতিটি মাইলফলক তৈরি হয়েছে পাঠকদের ভালোবাসায়।
                এই পথচলা এখনো চলছে — আরও বই, আরও গল্প, আরও মানুষের কাছে।
              </p>
              <div className="mt-5 space-y-4">
                {milestones.map((item, index) => (
                  <div key={item.year} className="flex gap-3">
                    <div className="flex flex-col items-center">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-gold-500 font-display text-[9px] font-bold text-forest-950">
                        {toBn(index + 1)}
                      </span>
                      {index < milestones.length - 1 && <span className="mt-1 h-full w-px flex-1 bg-white/15" />}
                    </div>
                    <div className="pb-1">
                      <p className="text-[9px] font-semibold uppercase tracking-[0.16em] text-gold-400">{item.year}</p>
                      <p className="mt-0.5 text-[12px] font-semibold text-cream-50">{item.title}</p>
                      <p className="mt-0.5 text-[10px] leading-relaxed text-cream-100/45">{item.text}</p>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            <div className="space-y-4">
              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                  <Users size={17} className="text-forest-600" /> আমাদের টিম
                </h2>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  ছোট একটি টিম, কিন্তু বইয়ের প্রতি ভালোবাসায় ভরা। কেউ দেখেন বই
                  বাছাই, কেউ লেখেন পর্যালোচনা, কেউ আবার সাজান অডিও আর গল্প।
                </p>
                <div className="mt-3 grid gap-2 sm:grid-cols-2">
                  {[
                    { name: "তানজিলা আহমেদ", role: "পাঠ সম্পাদনা ও কমিউনিটি", icon: PenLine },
                    { name: "আরিফ খান", role: "অডিও ও ভিডিও কিউরেশন", icon: Mic },
                    { name: "সাদিয়া ইসলাম", role: "গ্রাহক সেবা ও ডেলিভারি", icon: Truck },
                    { name: "তানভীর রহমান", role: "বই বাছাই ও প্রকাশনী সম্পর্ক", icon: LibraryBig },
                  ].map((member) => (
                    <div key={member.name} className="flex items-center gap-2.5 rounded-xl bg-cream-100/60 px-3 py-2.5">
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-forest-900 text-[10px] font-bold text-gold-300">
                        {member.name.charAt(0)}
                      </span>
                      <span className="min-w-0">
                        <span className="block truncate text-[10px] font-semibold text-forest-950">{member.name}</span>
                        <span className="block truncate text-[8px] text-muted">{member.role}</span>
                      </span>
                      <member.icon size={13} className="ml-auto shrink-0 text-forest-900/20" />
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-5 sm:p-6">
                <h2 className="flex items-center gap-2 font-display text-lg font-bold text-forest-950">
                  <MapPin size={17} className="text-forest-600" /> হেড অফিস
                </h2>
                <div className="mt-3 space-y-2 text-[11px] text-forest-800">
                  <p className="flex items-start gap-2">
                    <Building2 size={13} className="mt-0.5 shrink-0 text-forest-600" />
                    {siteConfig.address}
                  </p>
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-clay-600">
                    <Phone size={13} className="shrink-0 text-forest-600" /> {siteConfig.phone}
                  </a>
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-clay-600">
                    <Mail size={13} className="shrink-0 text-forest-600" /> {siteConfig.email}
                  </a>
                  <p className="flex items-center gap-2">
                    <Clock3 size={13} className="shrink-0 text-forest-600" /> শনি–বৃহস্পতি, সকাল ১০টা – রাত ৮টা
                  </p>
                </div>
                <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-forest-900/8 pt-3">
                  <SocialLinks iconSize={15} className="text-forest-700" />
                  <Link href="/contact" className="text-[10px] font-semibold text-clay-600 hover:text-clay-500">
                    ম্যাপে দেখুন →
                  </Link>
                </div>
              </section>

              <section className="rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-950">
                  <Sparkles size={13} className="text-gold-600" /> আমাদের অঙ্গীকার
                </p>
                <p className="mt-1 text-[10px] leading-relaxed text-muted">
                  প্রতিটি বই ১০০% অরিজিনাল, প্রতিটি পাঠক গুরুত্বপূর্ণ। কোনো সমস্যা
                  হলে আমরা শুনি এবং সমাধান করি — এটাই TalkNest-এর প্রতিশ্রুতি।
                </p>
              </section>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl bg-clay-500 px-5 py-4 text-cream-50 sm:flex-row">
            <p className="flex items-center gap-2 text-center text-xs font-medium sm:text-left">
              <BookHeart size={16} /> আপনার পাশে থাকতে চাই — বই থেকে জীবনের প্রতিটি গল্পে।
            </p>
            <Button href="/stories" variant="light" size="sm">
              পাঠকের গল্প পড়ুন
            </Button>
          </div>
        </Container>
      </section>
    </>
  );
}
