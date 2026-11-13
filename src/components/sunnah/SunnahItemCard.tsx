"use client";

import Link from "next/link";
import { Plus } from "lucide-react";
import type { SunnahItem } from "@/lib/types";
import { formatPrice } from "@/lib/utils";
import { useStore } from "@/lib/store";
import { SunnahItemArt } from "./SunnahItemArt";

export function SunnahItemCard({ item }: { item: SunnahItem }) {
  const { addItem } = useStore();
  const href = `/sunnah-items/${item.slug}`;

  return (
    <article className="group flex h-full flex-col rounded-[8px] border border-line bg-white p-2.5 transition-colors duration-200 hover:border-brand-300 sm:p-3">
      <Link
        href={href}
        aria-label={`View details for ${item.name}`}
        className="block overflow-hidden rounded-[4px]"
      >
        <SunnahItemArt item={item} />
      </Link>

      <div className="flex flex-1 flex-col pt-2.5">
        <p className="line-clamp-1 text-[10px] text-muted">{item.subtitle}</p>
        <Link href={href} className="mt-0.5">
          <h3 className="line-clamp-1 text-[13px] font-medium text-ink transition-colors group-hover:text-brand-600 sm:text-sm">
            {item.name}
          </h3>
        </Link>
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
