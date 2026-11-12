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
    <article className="group flex h-full flex-col rounded-[8px] border border-line bg-white p-2.5 transition-colors duration-200 hover:border-brand-300 sm:p-3">
      <div
        className="relative grid aspect-[4/3] place-items-center overflow-hidden rounded-[4px]"
        style={{ backgroundColor: `${item.accent}40` }}
      >
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-900/10"
        />
        <div
          aria-hidden="true"
          className="absolute left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2 rounded-full border border-brand-900/10"
        />
        <span className="relative grid h-14 w-14 place-items-center rounded-full bg-white/75">
          <Icon
            size={28}
            strokeWidth={1.5}
            className="text-brand-800 transition-transform duration-500 group-hover:scale-110"
          />
        </span>
        {item.badge && (
          <span className="absolute left-2 top-2 rounded-[3px] bg-brand-600 px-2 py-1 text-[8px] font-medium leading-none text-white">
            {item.badge}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col pt-2.5">
        <p className="line-clamp-1 text-[10px] text-muted">{item.subtitle}</p>
        <h3 className="mt-0.5 line-clamp-1 text-[13px] font-medium text-ink sm:text-sm">
          {item.name}
        </h3>
        <div className="mt-auto flex items-end justify-between gap-2 pt-2.5">
          <div>
            <span className="text-[15px] font-bold text-ink">
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
            aria-label={`Add ${item.name} to cart`}
            className="grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-brand-600 text-white transition-colors hover:bg-brand-700"
          >
            <Plus size={15} />
          </button>
        </div>
      </div>
    </article>
  );
}
