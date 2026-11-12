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
        size={18}
        className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-brand-600"
        aria-hidden="true"
      />
      <input
        type="search"
        name="q"
        placeholder="Search books, authors, publishers..."
        aria-label="Search books"
        className="h-11 w-full rounded-full border border-hairline bg-white pl-11 pr-[96px] text-[13px] text-ink placeholder:text-muted/75 transition focus:border-brand-400 focus:outline-none focus:ring-2 focus:ring-brand-500/20 sm:text-sm"
      />
      <button
        type="submit"
        className="absolute bottom-1 right-1 top-1 rounded-full bg-brand-600 px-4 text-[11px] font-medium text-white transition-colors hover:bg-brand-700 sm:px-5 sm:text-xs"
      >
        Search
      </button>
    </form>
  );
}
