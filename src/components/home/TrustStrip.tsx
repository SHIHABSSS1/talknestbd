"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { TrustIcon } from "@/components/ui/TrustIcon";
import { useTrustContent } from "@/components/providers/TrustContentProvider";
import { trustTints } from "@/lib/trust-content";

export function TrustStrip() {
  const { content } = useTrustContent();
  if (content.cards.length === 0) return null;

  return (
    <section className="border-b border-line bg-canvas">
      <Container>
        <div className="grid grid-cols-2 gap-2 py-3 sm:gap-3 lg:grid-cols-4">
          {content.cards.map((card) => {
            const tint = trustTints[card.tint] ?? trustTints.brand;
            return (
              <Link
                key={card.id}
                href={card.href || "/"}
                className="group relative flex items-start gap-2 overflow-hidden rounded-[10px] border border-line bg-white px-2.5 py-2.5 transition-all duration-200 hover:-translate-y-0.5 hover:border-brand-300 hover:shadow-soft-shadow sm:items-center sm:gap-3 sm:px-4 sm:py-3.5"
              >
                <span
                  className={`grid h-8 w-8 shrink-0 place-items-center overflow-hidden rounded-[7px] ${tint.className} transition-colors duration-200 group-hover:bg-brand-600 group-hover:text-white sm:h-10 sm:w-10 sm:rounded-[8px]`}
                >
                  {card.src ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={card.src}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <TrustIcon
                      icon={card.icon}
                      className="h-4 w-4 sm:h-[18px] sm:w-[18px]"
                    />
                  )}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-[11.5px] font-bold leading-tight text-ink transition-colors group-hover:text-brand-700 sm:text-[13px] sm:leading-snug">
                    {card.title}
                  </span>
                  {card.text && (
                    <span className="mt-0.5 block text-[10px] leading-tight text-muted sm:text-[11px] sm:leading-snug">
                      {card.text}
                    </span>
                  )}
                </span>
                <ArrowUpRight
                  size={15}
                  className="hidden shrink-0 text-muted/40 transition-all duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600 sm:block"
                />
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
