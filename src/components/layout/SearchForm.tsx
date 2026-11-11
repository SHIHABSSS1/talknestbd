import { Search } from "lucide-react";
import { cn } from "@/lib/utils";

export function SearchForm({ className }: { className?: string }) {
  return (
    <form
      action="/search"
      method="get"
      role="search"
      className={cn("relative w-full", className)}
    >
      <Search
        size={17}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-forest-700/50"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        placeholder="বই, লেখক বা প্রকাশনী খুঁজুন..."
        aria-label="বই খুঁজুন"
        className="h-10 w-full rounded-full border border-forest-900/10 bg-white/80 pl-11 pr-24 text-[13px] text-forest-950 placeholder:text-muted/70 transition focus:border-forest-700/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-gold-500/25 sm:h-11"
      />
      <button
        type="submit"
        className="absolute right-1 top-1/2 h-8 -translate-y-1/2 rounded-full bg-forest-900 px-4 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700 sm:h-9 sm:text-xs"
      >
        খুঁজুন
      </button>
    </form>
  );
}
