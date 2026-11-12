import Link from "next/link";
import { BadgeCheck, Repeat2, Store, Truck } from "lucide-react";
import { Container } from "@/components/ui/Container";

const features = [
  {
    icon: Truck,
    title: "Free delivery",
    text: "On orders over ৳999",
    href: "/free-order",
  },
  {
    icon: Repeat2,
    title: "50% book buyback",
    text: "Return a book, get half back",
    href: "/buyback",
  },
  {
    icon: BadgeCheck,
    title: "100% authentic",
    text: "Publisher-approved editions",
    href: "/about",
  },
  {
    icon: Store,
    title: "Wholesale pricing",
    text: "Special rates for libraries",
    href: "/wholesale",
  },
];

export function TrustStrip() {
  return (
    <section className="border-b border-line bg-white">
      <Container>
        <div className="grid grid-cols-2 divide-x divide-y divide-line lg:grid-cols-4 lg:divide-y-0">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <Link
                key={feature.title}
                href={feature.href}
                className="group flex items-center gap-3 px-1 py-3.5 transition-colors hover:bg-brand-50/60 sm:px-4 lg:px-6"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-brand-50 text-brand-600 transition-colors group-hover:bg-brand-600 group-hover:text-white">
                  <Icon size={17} />
                </span>
                <span className="min-w-0">
                  <span className="block truncate text-[12px] font-bold text-ink sm:text-[13px]">
                    {feature.title}
                  </span>
                  <span className="mt-0.5 block truncate text-[10px] text-muted sm:text-[11px]">
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
