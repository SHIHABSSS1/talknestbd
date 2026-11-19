import Link from "next/link";
import type { ReactNode } from "react";
import { BookOpen, Heart, ShieldCheck, UserRound } from "lucide-react";

/**
 * Shared two-panel shell for the storefront auth screens.
 * Server-safe (no hooks) so both server and client forms can use it.
 */
export function AuthShell({
  eyebrow,
  title,
  subtitle,
  children,
  footer,
  icon,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
  children: ReactNode;
  footer?: ReactNode;
  icon?: ReactNode;
}) {
  return (
    <div className="grid overflow-hidden rounded-[2rem] border border-forest-900/8 bg-cream-50 shadow-[0_30px_70px_-55px_rgba(10,33,24,0.5)] lg:grid-cols-[1fr_1.05fr]">
      <div className="relative hidden overflow-hidden bg-forest-950 p-8 text-cream-50 lg:block">
        <div aria-hidden="true" className="absolute inset-0 paper-texture opacity-[0.1]" />
        <div
          aria-hidden="true"
          className="absolute -right-16 -top-20 h-56 w-56 rounded-full border border-gold-400/15"
        />
        <div
          aria-hidden="true"
          className="absolute -bottom-24 -left-16 h-64 w-64 rounded-full border border-gold-400/10"
        />
        <div className="relative flex h-full flex-col">
          <Link
            href="/"
            className="inline-flex w-fit items-center gap-2 rounded-full border border-gold-400/25 bg-white/5 px-3 py-1.5 text-[9px] font-semibold uppercase tracking-[0.18em] text-gold-300"
          >
            <BookOpen size={11} /> TalkNest Reader Club
          </Link>
          <h2 className="mt-6 max-w-sm font-display text-3xl font-bold leading-snug">
            Your reading world,
            <br />
            <span className="text-gold-300">in one account.</span>
          </h2>
          <p className="mt-3 max-w-sm text-sm leading-relaxed text-cream-100/55">
            Keep order tracking, saved addresses, your wishlist and audio
            library together in one place.
          </p>

          <div className="mt-8 space-y-3">
            {[
              { icon: Heart, title: "Synced wishlist", text: "Save the books you want to read" },
              { icon: ShieldCheck, title: "Secure orders", text: "Addresses and order history" },
              { icon: UserRound, title: "Reader profile", text: "Reviews and community activity" },
            ].map((item) => (
              <div key={item.title} className="flex items-center gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-white/10 text-gold-300">
                  <item.icon size={15} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold text-cream-50">{item.title}</p>
                  <p className="text-[9px] text-cream-100/40">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-auto rounded-2xl border border-white/10 bg-white/[0.04] p-4">
            <p className="font-display text-sm font-semibold text-gold-300">
              &ldquo;Every book opens the door to another life.&rdquo;
            </p>
            <p className="mt-1 text-[9px] text-cream-100/40">— A TalkNest reader</p>
          </div>
        </div>
      </div>

      <div className="p-5 sm:p-8">
        <div className="flex items-center justify-between gap-3">
          <div>
            <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
              {eyebrow}
            </p>
            <h1 className="mt-1 font-display text-2xl font-bold text-forest-950 sm:text-3xl">
              {title}
            </h1>
            <p className="mt-1 text-[11px] text-muted">{subtitle}</p>
          </div>
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-forest-100 text-forest-700">
            {icon ?? <UserRound size={20} />}
          </span>
        </div>

        <div className="mt-5">{children}</div>

        {footer ? <div className="mt-5">{footer}</div> : null}

        <div className="mt-5 flex justify-center">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-100/70 px-3 py-1.5 text-[9px] font-medium text-forest-700">
            <ShieldCheck size={11} /> Secured by Better Auth
          </span>
        </div>
      </div>
    </div>
  );
}
