import Link from "next/link";
import { BookOpen, Clock3, Mail, MapPin, Phone, Sparkles } from "lucide-react";
import { footerLinks } from "@/lib/navigation";
import { siteConfig } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { Logo } from "./Logo";
import { NewsletterForm } from "./NewsletterForm";
import { SocialLinks } from "./SocialLinks";

export function Footer() {
  return (
    <footer className="print-hide mt-12 bg-brand-950 pb-16 text-white/65 md:pb-0">
      <div className="bg-canvas">
        <Container className="py-10 sm:py-12">
          <div className="hero-mesh relative overflow-hidden rounded-[12px] px-5 py-7 text-white sm:px-8 sm:py-9 lg:px-10">
            <div
              aria-hidden="true"
              className="absolute -right-16 -top-24 h-72 w-72 rounded-full border border-white/10"
            />
            <div
              aria-hidden="true"
              className="absolute -bottom-32 left-1/3 h-72 w-72 rounded-full border border-white/10"
            />
            <div className="relative grid gap-7 lg:grid-cols-[1.05fr_0.95fr] lg:items-center lg:gap-14">
              <div>
                <span className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-[10px] font-medium uppercase tracking-[0.12em] text-white/80">
                  <Sparkles size={11} className="text-sale" />
                  The TalkNest Letter
                </span>
                <h2 className="mt-3 max-w-2xl text-[24px] font-bold leading-tight text-white sm:text-[30px]">
                  Better books for your inbox, not more noise.
                </h2>
                <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-white/70 sm:text-sm">
                  A weekly edit of new releases, reader favourites, author stories
                  and subscriber-only offers.
                </p>
                <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-[10px] text-white/65">
                  <span className="inline-flex items-center gap-1.5">
                    <BookOpen size={12} className="text-brand-200" /> One thoughtful email a week
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Mail size={12} className="text-brand-200" /> Unsubscribe anytime
                  </span>
                </div>
              </div>
              <NewsletterForm />
            </div>
          </div>
        </Container>
      </div>

      <Container className="grid grid-cols-2 gap-x-5 gap-y-10 py-12 lg:grid-cols-[1.45fr_1fr_1fr_1fr] lg:gap-8">
        <div className="col-span-2 lg:col-span-1">
          <Logo light />
          <p className="mt-5 max-w-xs text-xs leading-relaxed text-white/55 sm:text-[13px]">
            A warm home for books, stories, audiobooks and a community of readers
            in Bangladesh. Finding a good book should feel simple.
          </p>
          <div className="mt-6 space-y-3 text-xs leading-relaxed">
            <p className="flex items-start gap-2.5">
              <MapPin size={15} className="mt-0.5 shrink-0 text-brand-300" />
              <span>
                <span className="block font-medium text-white">Head office</span>
                {siteConfig.address}
              </span>
            </p>
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Phone size={14} className="shrink-0 text-brand-300" />
              {siteConfig.phone}
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="flex items-center gap-2.5 transition-colors hover:text-white"
            >
              <Mail size={14} className="shrink-0 text-brand-300" />
              {siteConfig.email}
            </a>
            <p className="flex items-center gap-2.5">
              <Clock3 size={14} className="shrink-0 text-brand-300" />
              Saturday–Thursday, 10:00 AM – 8:00 PM
            </p>
          </div>
          <SocialLinks
            labels
            iconSize={16}
            className="mt-5 border border-white/15 px-4 py-2.5"
          />
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Browse books</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px]">
            {footerLinks.shop.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-bold text-white">Services</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px]">
            {footerLinks.services.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div className="col-span-2 lg:col-span-1">
          <h3 className="text-sm font-bold text-white">Community</h3>
          <ul className="mt-4 space-y-2.5 text-xs sm:text-[13px]">
            {footerLinks.community.map((link) => (
              <li key={link.href}>
                <Link href={link.href} className="transition-colors hover:text-white">
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
          <Link
            href="/contact"
            className="mt-5 inline-flex border border-white/25 px-4 py-2 text-[11px] font-medium text-white transition-colors hover:border-white hover:bg-white hover:text-brand-800"
          >
            Get support
          </Link>
        </div>
      </Container>

      <div className="border-t border-white/12">
        <Container className="flex flex-col gap-4 py-5 text-[10px] sm:flex-row sm:items-center sm:justify-between sm:text-[11px]">
          <p>© 2026 TalkNest BD. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-4">
            <Link href="/privacy" className="transition-colors hover:text-white">
              Privacy Policy
            </Link>
            <Link href="/return-policy" className="transition-colors hover:text-white">
              Return Policy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-white">
              Terms
            </Link>
            <Link href="/blogs" className="transition-colors hover:text-white">
              Blog
            </Link>
            <span className="flex items-center gap-1.5 text-white/45">
              Payment:
              <span className="bg-white/10 px-2 py-1 font-medium text-white">bKash</span>
              <span className="bg-white/10 px-2 py-1 font-medium text-white">Nagad</span>
              <span className="bg-white/10 px-2 py-1 font-medium text-white">COD</span>
            </span>
          </div>
        </Container>
      </div>
    </footer>
  );
}
