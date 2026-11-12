"use client";

import { MapPin, Plus, Check } from "lucide-react";
import type { SavedAddress } from "@/lib/orders";
import { cn } from "@/lib/utils";

export function SavedAddressPicker({
  addresses,
  selectedId,
  newSelected,
  onSelect,
  onSelectNew,
}: {
  addresses: SavedAddress[];
  selectedId: string | null;
  newSelected: boolean;
  onSelect: (address: SavedAddress) => void;
  onSelectNew: () => void;
}) {
  return (
    <div className="grid gap-2 sm:grid-cols-2">
      {addresses.map((address) => {
        const active = !newSelected && selectedId === address.id;
        return (
          <button
            key={address.id}
            type="button"
            onClick={() => onSelect(address)}
            className={cn(
              "relative rounded-2xl border p-3.5 text-left transition-all",
              active
                ? "border-forest-700 bg-forest-50/80 ring-1 ring-forest-700/20"
                : "border-forest-900/10 bg-cream-50 hover:border-forest-900/25",
            )}
          >
            <span className="flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-wider text-forest-700">
              <MapPin size={12} />
              {address.label}
              {address.isDefault && (
                <span className="rounded-full bg-gold-500/20 px-1.5 py-0.5 text-[8px] text-gold-600">
                  Default
                </span>
              )}
            </span>
            <span className="mt-1.5 block text-xs font-semibold text-forest-950">
              {address.name}
            </span>
            <span className="mt-0.5 block text-[10px] text-muted">{address.phone}</span>
            <span className="mt-1 block line-clamp-2 text-[10px] leading-relaxed text-muted">
              {address.street}, {address.area}, {address.district}, {address.division}
              {address.postcode ? ` - ${address.postcode}` : ""}
            </span>
            {active && (
              <span className="absolute right-3 top-3 grid h-5 w-5 place-items-center rounded-full bg-forest-800 text-cream-50">
                <Check size={12} />
              </span>
            )}
          </button>
        );
      })}

      <button
        type="button"
        onClick={onSelectNew}
        className={cn(
          "flex min-h-[108px] flex-col items-center justify-center gap-1.5 rounded-2xl border border-dashed p-3.5 text-center transition-all",
          newSelected
            ? "border-forest-700 bg-forest-50/80 text-forest-800 ring-1 ring-forest-700/20"
            : "border-forest-900/20 text-muted hover:border-forest-900/40 hover:bg-cream-100/60",
        )}
      >
        <span className="grid h-8 w-8 place-items-center rounded-full bg-forest-100 text-forest-700">
          <Plus size={15} />
        </span>
        <span className="text-[11px] font-semibold">Add a new address</span>
      </button>
    </div>
  );
}
