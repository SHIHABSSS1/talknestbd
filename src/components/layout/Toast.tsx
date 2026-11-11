"use client";

import { CheckCircle2 } from "lucide-react";
import { useStore } from "@/lib/store";

export function Toast() {
  const { toast } = useStore();

  if (!toast) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="print-hide pointer-events-none fixed bottom-20 left-1/2 z-[100] w-max max-w-[90vw] -translate-x-1/2 md:bottom-8"
    >
      <div className="flex items-center gap-2.5 rounded-full border border-white/10 bg-forest-950 px-5 py-3 text-sm font-medium text-cream-50 shadow-xl">
        <CheckCircle2 size={17} className="text-gold-400" aria-hidden="true" />
        {toast}
      </div>
    </div>
  );
}
