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
    <footer className="print-hide mt-12 bg-brand-950 pb-16 text-white/65 md:pb-0">
      <div className="bg-brand-600">
        <Container className="grid gap-7 py-10 sm:py-12 lg:grid-cols-[1.15fr_1fr] lg:items-center lg:gap-16">
          <div>
            <span className="text-[10px] font-medium uppercase tracking-[0.18em] text-white/65">
              The TalkNest Letter
            </span>
            <h2 className="mt-2 text-[22px] font-bold leading-snug text-white sm:text-[28px]">
              New books, author stories and offers — once a week.
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-white/70">
              One thoughtful email with the best new releases, reader reviews and
              TalkNest events. No noise, no daily spam.
            </p>
          </div>
          <NewsletterForm />
        </Container>
      </div>

      <Container className="grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-[1.45fr_1fr_1fr_1fr] lg:gap-8">
        <div>
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

        <div>
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
