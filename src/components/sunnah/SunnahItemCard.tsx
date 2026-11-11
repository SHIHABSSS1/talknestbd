"use client";

import {
  CircleDot,
  Droplets,
  Gem,
  Gift,
  Moon,
  PenLine,
  Plus,
  Sparkles,
  Sun,
} from "lucide-react";
import type { SunnahIcon, SunnahItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/lib/store";

const icons = {
  sparkles: Sparkles,
  "circle-dot": CircleDot,
  droplets: Droplets,
  moon: Moon,
  "notebook-pen": PenLine,
  gem: Gem,
  gift: Gift,
  sun: Sun,
} satisfies Record<SunnahIcon, typeof Sparkles>;

export function SunnahItemCard({ item }: { item: SunnahItem }) {
  const { addItem } = useStore();
  const Icon = icons[item.icon];

  return (
    <article className="group flex h-full flex-col rounded-2xl border border-forest-900/8 bg-white/70 p-3 transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:shadow-[0_20px_40px_-30px_rgba(10,33,24,0.4)]">
      <div
        className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-xl"
        style={{
          background: `linear-gradient(145deg, ${item.accent}12, ${item.accent}28)`,
        }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-28 w-28 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-20"
          style={{ borderColor: item.accent }}
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-20 w-20 -translate-x-1/2 -translate-y-1/2 rounded-full border opacity-15"
          style={{ borderColor: item.accent }}
        />
        <Icon
          size={40}
          strokeWidth={1.3}
          className="relative transition-transform duration-500 group-hover:scale-110"
          style={{ color: item.accent }}
        />
        {item.badge && (
          <span
            className="absolute left-2.5 top-2.5 rounded-full px-2 py-0.5 text-[8px] font-semibold text-white"
            style={{ backgroundColor: item.accent }}
          >
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-3">
        <p className="text-[9px] text-muted">{item.subtitle}</p>
        <h3 className="mt-0.5 line-clamp-1 font-display text-sm font-semibold text-forest-950 sm:text-base">
          {item.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div>
            <span className="font-display text-base font-bold text-forest-950">
              {formatPrice(item.price)}
            </span>
            {item.oldPrice && (
              <span className="ml-1.5 text-[10px] text-muted line-through">
                {formatPrice(item.oldPrice)}
              </span>
            )}
          </div>
          <button
            type="button"
            onClick={() =>
              addItem({
                slug: item.slug,
                kind: "sunnah",
                title: item.name,
                price: item.price,
                meta: item.subtitle,
              })
            }
            aria-label={`${item.name} কার্টে যোগ করুন`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-forest-900 text-cream-50 transition-colors hover:bg-gold-500 hover:text-forest-950"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
