import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

/**
 * Official TalkNest BD branding from public/talknest.
 * The white variant is used on dark surfaces (footer, dark headers).
 */
export function Logo({
  light = false,
  compact = false,
}: {
  light?: boolean;
  compact?: boolean;
}) {
  if (compact) {
    return (
      <Link href="/" className="group flex shrink-0 items-center gap-2.5">
        <Image
          src={light ? "/talknest/icon-white.png" : "/talknest/icon-colored.png"}
          alt="TalkNest BD"
          width={36}
          height={36}
          className="h-9 w-9 object-contain transition-transform duration-200 group-hover:scale-105 sm:h-10 sm:w-10"
          priority
        />
        <span
          className={cn(
            "text-[18px] font-bold leading-none tracking-tight sm:text-[20px]",
            light ? "text-white" : "text-ink",
          )}
        >
          TalkNest BD
        </span>
      </Link>
    );
  }

  return (
    <Link href="/" className="group flex shrink-0 items-center">
      <Image
        src={light ? "/talknest/logo-white.png" : "/talknest/logo-colored.png"}
        alt="TalkNest BD — books, stories and community"
        width={132}
        height={52}
        priority
        className="h-auto w-[112px] object-contain object-left transition-transform duration-200 group-hover:scale-[1.03] sm:w-[132px]"
      />
    </Link>
  );
}
