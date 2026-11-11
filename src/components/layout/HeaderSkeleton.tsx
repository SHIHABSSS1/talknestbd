import { MapPin, Search, Truck } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { Logo } from "./Logo";

/**
 * Static shell for the header while `usePathname` resolves on routes with
 * dynamic params. Keeps the layout stable and avoids a build-time suspense
 * error with Cache Components.
 */
export function HeaderSkeleton() {
  return (
    <header className="print-hide relative z-40" aria-hidden="true">
      <div className="bg-forest-950">
        <div className="mx-auto flex h-9 w-full max-w-7xl items-center justify-between gap-4 px-4 text-[10px] sm:px-6 sm:text-[11px] lg:px-8">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-cream-100/75">
            <Truck size={13} className="text-gold-400" />
            ৳{siteConfig.freeDeliveryThreshold}+ অর্ডারে ফ্রি ডেলিভারি
          </span>
          <span className="hidden items-center gap-1 text-cream-100/50 lg:flex">
            <MapPin size={12} />
            {siteConfig.address}
          </span>
        </div>
      </div>

      <div className="sticky top-0 z-50 border-b border-forest-900/8 bg-cream-50/95 shadow-[0_8px_30px_-24px_rgba(10,33,24,0.5)] backdrop-blur-xl">
        <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-[66px] items-center gap-3 sm:h-[72px] sm:gap-5">
            <span className="h-10 w-10 shrink-0 md:hidden" />
            <Logo />
            <div className="mx-auto hidden h-10 w-full max-w-md items-center gap-2 rounded-full border border-forest-900/10 bg-cream-100/60 px-4 text-forest-900/35 md:flex lg:max-w-lg">
              <Search size={16} />
              <span className="text-[11px]">বই, লেখক বা প্রকাশনী খুঁজুন...</span>
            </div>
            <div className="ml-auto flex items-center gap-1 sm:gap-1.5 md:ml-0">
              <span className="h-10 w-10 rounded-full bg-cream-100" />
              <span className="hidden h-10 w-10 rounded-full bg-cream-100 sm:block" />
              <span className="h-10 w-10 rounded-full bg-forest-900/15" />
            </div>
          </div>
          <div className="pb-3 md:hidden">
            <div className="h-10 rounded-full border border-forest-900/10 bg-cream-100/60" />
          </div>
        </div>
        <div className="hidden border-t border-forest-900/5 md:block">
          <div className="mx-auto flex h-11 w-full max-w-7xl items-center gap-4 px-4 sm:px-6 lg:gap-6 lg:px-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <span
                key={index}
                className="h-3 w-14 animate-pulse rounded-full bg-forest-900/8"
              />
            ))}
          </div>
        </div>
      </div>
    </header>
  );
}
