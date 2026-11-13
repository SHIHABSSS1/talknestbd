import { MapPin, Truck, User } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { Logo } from "./Logo";

/**
 * Static shell for the header while `usePathname` resolves on routes with
 * dynamic params. Keeps the layout stable and avoids a build-time suspense
 * error with Cache Components.
 */
export function HeaderSkeleton() {
  return (
    <>
      <div className="print-hide relative z-40 border-b border-line bg-white" aria-hidden="true">
        <div className="mx-auto flex h-9 w-full max-w-[1425px] items-center justify-between gap-4 px-4 text-[11px] sm:px-6 lg:px-8">
          <span className="flex items-center gap-1.5 whitespace-nowrap text-muted">
            <Truck size={13} className="text-brand-600" />
            Free delivery on orders over ৳{siteConfig.freeDeliveryThreshold}
          </span>
          <span className="hidden items-center gap-1 text-muted lg:flex">
            <MapPin size={12} />
            {siteConfig.address}
          </span>
        </div>
      </div>

      <header className="print-hide sticky top-0 z-50 border-b border-line bg-white shadow-[0_1px_0_rgba(17,24,39,0.06)]" aria-hidden="true">
        <div className="mx-auto w-full max-w-[1425px] px-4 sm:px-6 lg:px-8">
          <div className="flex h-[64px] items-center gap-3 sm:h-[72px] sm:gap-5">
            <span className="h-10 w-10 shrink-0 rounded-[4px] border border-line lg:hidden" />
            <Logo />
            <div className="ml-auto flex items-center gap-2">
              <span className="grid h-10 w-10 place-items-center rounded-full bg-canvas text-muted xl:hidden">
                <User size={18} />
              </span>
              <span className="hidden h-10 w-20 rounded-[4px] bg-brand-100 sm:block" />
            </div>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[1425px] px-4 sm:px-6 lg:px-8">
          <div className="mx-auto w-full max-w-2xl pb-3">
            <div className="h-11 rounded-full border border-hairline bg-white" />
          </div>
        </div>
        <div className="hidden bg-brand-600 lg:block">
          <div className="mx-auto flex h-10 w-full max-w-[1425px] items-center gap-4 px-4 sm:px-6 lg:px-8">
            {Array.from({ length: 6 }).map((_, index) => (
              <span
                key={index}
                className="h-3 w-16 animate-pulse rounded-[2px] bg-white/25"
              />
            ))}
          </div>
        </div>
      </header>
    </>
  );
}
