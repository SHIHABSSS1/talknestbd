import type { Metadata } from "next";
import Link from "next/link";
import {
  Clock3,
  Headphones,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ContactForm } from "@/components/contact/ContactForm";
import { Button } from "@/components/ui/Button";
import { siteConfig } from "@/lib/utils";

export const metadata: Metadata = {
  title: "যোগাযোগ",
  description:
    "TalkNest BD-এর হেড অফিস, ফোন, ইমেইল, হোয়াটসঅ্যাপ ও যোগাযোগ ফর্ম — বই, অর্ডার, ডেলিভারি বা পাইকারি যেকোনো বিষয়ে সহায়তা।",
};

const channels = [
  {
    icon: Phone,
    title: "ফোনে কথা বলুন",
    detail: siteConfig.phone,
    note: "শনি–বৃহস্পতি, সকাল ১০টা – রাত ৮টা",
    href: `tel:${siteConfig.phone}`,
    action: "কল করুন",
  },
  {
    icon: MessageCircle,
    title: "হোয়াটসঅ্যাপ",
    detail: "দ্রুত উত্তর",
    note: "বই, অর্ডার বা ডেলিভারি নিয়ে সরাসরি মেসেজ",
    href: siteConfig.whatsapp,
    action: "মেসেজ করুন",
  },
  {
    icon: Mail,
    title: "ইমেইল",
    detail: siteConfig.email,
    note: "১ কর্মদিবসের মধ্যে উত্তর",
    href: `mailto:${siteConfig.email}`,
    action: "ইমেইল করুন",
  },
  {
    icon: MapPin,
    title: "হেড অফিস",
    detail: siteConfig.address,
    note: "পূর্ব পরিকল্পনায় ভিজিট করুন",
    href: "#map",
    action: "ম্যাপে দেখুন",
  },
];

const quickLinks = [
  { icon: ShoppingBag, title: "অর্ডার ট্র্যাক", text: "অর্ডার নম্বর দিয়ে রিসিট দেখুন", href: "/account/orders" },
  { icon: Truck, title: "ডেলিভারি তথ্য", text: "চার্জ ও সময়সীমা জানুন", href: "/free-order" },
  { icon: Headphones, title: "অডিও সহায়তা", text: "অডিও বুক আনলক সংক্রান্ত", href: "/audio-books" },
];

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact Us"
        title="আমরা আপনার কথা শুনতে চাই"
        description="বই খুঁজে পাচ্ছেন না? অর্ডার নিয়ে প্রশ্ন আছে? নাকি শুধু একটি ভালো বইয়ের সুপারিশ চান? যেকোনো বিষয়ে আমাদের জানান — TalkNest টিম পাশে আছে।"
        crumbs={[{ label: "যোগাযোগ" }]}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
          <Clock3 size={12} /> সাধারণত ১ কর্মদিবসে সাড়া
        </span>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-4">
            {channels.map((channel) => (
              <div key={channel.title} className="flex flex-col rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-forest-100 text-forest-700">
                  <channel.icon size={17} />
                </span>
                <h2 className="mt-3 text-[11px] font-semibold text-forest-950">{channel.title}</h2>
                <p className="mt-0.5 text-[11px] font-medium text-forest-800">{channel.detail}</p>
                <p className="mt-1 flex-1 text-[9px] leading-relaxed text-muted">{channel.note}</p>
                <a
                  href={channel.href}
                  target={channel.href.startsWith("http") ? "_blank" : undefined}
                  rel={channel.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="mt-3 inline-flex h-8 items-center justify-center rounded-full border border-forest-900/15 text-[9px] font-semibold text-forest-800 transition-colors hover:bg-forest-900 hover:text-cream-50"
                >
                  {channel.action}
                </a>
              </div>
            ))}
          </div>

          <div className="mt-6 grid gap-5 lg:grid-cols-[1.05fr_0.95fr] lg:items-start">
            <ContactForm />

            <div className="space-y-4">
              <section id="map" className="scroll-mt-32 overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
                <div className="flex items-center justify-between gap-2 border-b border-forest-900/8 px-4 py-3">
                  <div>
                    <h2 className="flex items-center gap-1.5 font-display text-base font-bold text-forest-950">
                      <MapPin size={15} className="text-forest-600" /> হেড অফিস ম্যাপ
                    </h2>
                    <p className="text-[9px] text-muted">{siteConfig.address}</p>
                  </div>
                  <Link
                    href="https://www.google.com/maps/search/?api=1&query=Bailey+Road+Dhaka"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="shrink-0 text-[9px] font-semibold text-clay-600 hover:text-clay-500"
                  >
                    Google Maps →
                  </Link>
                </div>
                <iframe
                  title="TalkNest BD হেড অফিস অবস্থান"
                  src="https://maps.google.com/maps?q=Bailey%20Road%2C%20Dhaka&t=&z=15&ie=UTF8&iwloc=&output=embed"
                  className="h-[280px] w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                />
              </section>

              <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4">
                <h2 className="font-display text-base font-bold text-forest-950">দ্রুত সহায়তা</h2>
                <div className="mt-2.5 space-y-2">
                  {quickLinks.map((item) => (
                    <Link
                      key={item.title}
                      href={item.href}
                      className="flex items-center gap-2.5 rounded-xl bg-cream-100/60 px-3 py-2.5 transition-colors hover:bg-cream-100"
                    >
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-cream-50 text-forest-700">
                        <item.icon size={14} />
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-[10px] font-semibold text-forest-900">{item.title}</span>
                        <span className="block text-[8px] text-muted">{item.text}</span>
                      </span>
                    </Link>
                  ))}
                </div>
              </section>

              <div className="rounded-2xl bg-forest-950 p-4 text-cream-50">
                <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-gold-400">
                  সহায়তার সময়
                </p>
                <div className="mt-2 space-y-1.5 text-[10px] text-cream-100/60">
                  <p className="flex items-center justify-between gap-2">
                    <span>শনি – বৃহস্পতি</span>
                    <span className="font-semibold text-cream-50">সকাল ১০টা – রাত ৮টা</span>
                  </p>
                  <p className="flex items-center justify-between gap-2">
                    <span>শুক্রবার</span>
                    <span className="text-cream-100/40">বন্ধ (অনলাইন অর্ডার চালু)</span>
                  </p>
                </div>
                <p className="mt-2.5 border-t border-white/10 pt-2 text-[9px] leading-relaxed text-cream-100/40">
                  ছুটির দিনে ফোনে সাড়া পেতে দেরি হতে পারে; হোয়াটসঅ্যাপে মেসেজ
                  রেখে দিলে পরের কর্মদিবসে উত্তর পাবেন।
                </p>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-2xl border border-gold-500/20 bg-gold-500/8 px-5 py-4 sm:flex-row">
            <p className="text-center text-[11px] text-forest-800/75 sm:text-left">
              পাইকারি বা প্রতিষ্ঠানিক অর্ডারের জন্য আলাদা টিম প্রস্তুত।
            </p>
            <div className="flex flex-wrap gap-2">
              <Button href="/wholesale" size="sm">পাইকারি অর্ডার</Button>
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
