import Link from "next/link";
import { Clock3, Mail, MapPin, Phone } from "lucide-react";
import { footerLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="print-hide mt-10 bg-forest-950 pb-16 text-cream-100/65 md:pb-0">
      <div className="border-b border-white/10">
        <Container className="grid gap-8 py-11 sm:py-14 lg:grid-cols-[1.2fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold-400">
              TalkNest Newsletter
            </span>
            <h2 className="mt-2 font-display text-2xl font-bold text-cream-50 sm:text-3xl">
              নতুন বই, লেখকের গল্প আর অফারের খবর
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-cream-100/55">
              সপ্তাহে একটি মেইল — নতুন প্রকাশিত বই, পাঠকের রিভিউ আর TalkNest-এর
              আয়োজনগুলো সবার আগে জানুন।
            </p>
          </div>
          <NewsletterForm />
        </Container>
      </div>

      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr] lg:gap-8">
        <div>
          <Logo light />
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-cream-100/55 sm:text-[13px]">
            বাংলাদেশের পাঠকদের জন্য বই, গল্প, অডিও ও কমিউনিটির একটি উষ্ণ নীড়।
            ভালো বই খুঁজে পাওয়া আর ভাগ করে নেওয়া সহজ হোক।
          </p>
          <div className="mt-6 space-y-3 text-xs leading-relaxed">
            <p className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-gold-400" />
              <span>
                <span className="block font-semibold text-cream-50">হেড অফিস</span>
                {siteConfig.address}
              </span>
            </p>
            <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2.5 transition-colors hover:text-gold-300">
              <Phone size={14} className="shrink-0 text-gold-400" />
              {siteConfig.phone}
            </a>
            <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2.5 transition-colors hover:text-gold-300">
              <Mail size={14} className="shrink-0 text-gold-400" />
              {siteConfig.email}
            </a>
            <p className="flex items-center gap-2.5">
              <Clock3 size={14} className="shrink-0 text-gold-400" />
              শনি–বৃহস্পতি, সকাল ১০টা – রাত ৮টা
            </p>
          </div>
          <SocialLinks
            labels
            iconSize={16}
            className="mt-5 rounded-full border border-white/10 px-4 py-2.5"
          />
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-cream-50">বই ঘুরে দেখুন</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px]">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-cream-50">সেবা</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px]">
            {footerLinks.services.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-display text-sm font-semibold text-cream-50">কমিউনিটি</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px]">
            {footerLinks.community.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-gold-300">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-5 inline-flex rounded-full border border-gold-400/40 px-4 py-2 text-[11px] font-semibold text-gold-300 transition-colors hover:bg-gold-500 hover:text-forest-950"
          >
            সহায়তা নিন
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/10">
        <Container className="flex flex-col gap-4 py-5 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
          <p>© ২০২৬ TalkNest BD। সর্বস্বত্ব সংরক্ষিত।</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-gold-300">
              প্রাইভেসি পলিসি
            </Link>
            <Link href="/return-policy" className="transition-colors hover:text-gold-300">
              রিটার্ন পলিসি
            </Link>
            <Link href="/terms" className="transition-colors hover:text-gold-300">
              শর্তাবলি
            </Link>
            <Link href="/blogs" className="transition-colors hover:text-gold-300">
              ব্লগ
            </Link>
            <span className="flex items-center gap-1.5 text-cream-100/45">
              পেমেন্ট:
              <span className="rounded-md bg-white/10 px-2 py-1 font-semibold text-cream-50">bKash</span>
              <span className="rounded-md bg-white/10 px-2 py-1 font-semibold text-cream-50">Nagad</span>
              <span className="rounded-md bg-white/10 px-2 py-1 font-semibold text-cream-50">COD</span>
            </span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
