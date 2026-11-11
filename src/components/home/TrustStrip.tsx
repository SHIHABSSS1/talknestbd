import Link from "next/link";
import {
  BadgeCheck,
  Headphones,
  RotateCcw,
  Store,
  Truck,
} from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: Truck,
    title: "ফ্রি ডেলিভারি",
    text: "৳৯৯৯+ অর্ডারে সারা দেশে",
    href: "/free-order",
  },
  {
    icon: RotateCcw,
    title: "৫০% বই ফেরত",
    text: "পড়া শেষে ফেরত দিলে ৫০% টাকা",
    href: "/buyback",
  },
  {
    icon: BadgeCheck,
    title: "১০০% অরিজিনাল",
    text: "প্রকাশকের অনুমোদিত বই",
    href: "/about",
  },
  {
    icon: Store,
    title: "পাইকারি সুবিধা",
    text: "লাইব্রেরি ও ব্যবসার জন্য বিশেষ দাম",
    href: "/wholesale",
  },
];

export function TrustStrip() {
  return (
    <section className="relative z-20 -mt-6 sm:-mt-8">
      <Container>
        <div className="grid overflow-hidden rounded-2xl border border-forest-900/8 bg-cream-50 shadow-[0_24px_60px_-40px_rgba(10,33,24,0.6)] sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex items-center gap-3 border-b border-forest-900/8 px-4 py-4 transition-colors hover:bg-cream-100/80 last:border-b-0 sm:last:border-b sm:[&:nth-child(2n)]:border-l lg:border-b-0 lg:border-l lg:first:border-l-0 sm:[&:nth-child(2)]:border-l-0 lg:[&:nth-child(2)]:border-l lg:[&:nth-child(3)]:border-l"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-forest-100 text-forest-700 transition-colors group-hover:bg-forest-900 group-hover:text-cream-50">
                  <Icon size={18} />
                </span>
                <span>
                  <span className="block text-[13px] font-semibold text-forest-950 sm:text-sm">
                    {feature.title}
                  </span>
                  <span className="block text-[10px] leading-snug text-muted sm:text-[11px]">
                    {feature.text}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
