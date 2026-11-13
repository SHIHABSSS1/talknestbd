import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Repeat2, Store, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: Truck,
    title: "Free delivery",
    text: "On orders over ৳999",
    href: "/free-order",
    tint: "bg-brand-50 text-brand-600",
  },
  {
    icon: Repeat2,
    title: "50% book buyback",
    text: "Return a book, get half back",
    href: "/buyback",
    tint: "bg-[#fff5e6] text-sale",
  },
  {
    icon: BadgeCheck,
    title: "100% authentic",
    text: "Publisher-approved editions",
    href: "/about",
    tint: "bg-brand-50 text-brand-600",
  },
  {
    icon: Store,
    title: "Wholesale pricing",
    text: "Special rates for libraries",
    href: "/wholesale",
    tint: "bg-brand-50 text-brand-600",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-canvas">
      <Container>
        <div className="grid grid-cols-1 gap-2.5 py-3 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group relative flex items-center gap-3 overflow-hidden rounded-[10px] border border-line bg-white px-3.5 py-3 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-shadow sm:px-4 sm:py-3.5"
              >
                <span
                  className={`grid h-10 w-10 shrink-0 place-items-center rounded-[8px] ${feature.tint} transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white`}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-bold leading-snug text-ink transition-colors group-hover:text-brand-700">
                    {feature.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[11px] leading-snug text-muted">
                    {feature.text}
                  </span>
                </span>
                <ArrowUpRight
                  size={15}
                  className="shrink-0 text-muted/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
