import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import { Container } from "./Container";
import { Breadcrumb, type Crumb } from "./Breadcrumb";

export function PageHeader({
  eyebrow,
  title,
  description,
  crumbs,
  children,
  tone = "cream",
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  crumbs?: Crumb[];
  children?: ReactNode;
  tone?: "cream" | "dark";
  className?: string;
}) {
  const dark = tone === "dark";

  return (
    <section
      className={cn(
        "relative overflow-hidden border-b",
        dark
          ? "hero-mesh border-white/5 text-cream-50"
          : "border-forest-900/8 bg-cream-100/60 text-forest-950",
        className,
      )}
    >
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute inset-0",
          dark ? "paper-texture opacity-[0.12]" : "paper-texture opacity-[0.35]",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-24 -top-32 h-72 w-72 rounded-full border",
          dark ? "border-gold-400/15" : "border-forest-900/8",
        )}
      />
      <div
        aria-hidden="true"
        className={cn(
          "pointer-events-none absolute -right-8 -top-16 h-44 w-44 rounded-full border",
          dark ? "border-gold-400/10" : "border-forest-900/6",
        )}
      />

      <Container className="relative py-8 sm:py-12 lg:py-14">
        {crumbs && <Breadcrumb items={crumbs} light={dark} className="mb-5" />}
        <div className="max-w-3xl">
          {eyebrow && (
            <span
              className={cn(
                "inline-flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] sm:text-[11px]",
                dark ? "text-gold-400" : "text-clay-500",
              )}
            >
              <span
                className={cn(
                  "h-px w-6",
                  dark ? "bg-gold-400/60" : "bg-clay-500/50",
                )}
              />
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "mt-2.5 font-display text-3xl font-bold leading-[1.2] tracking-tight sm:text-4xl lg:text-[2.9rem]",
              dark ? "text-cream-50" : "text-forest-950",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-3 max-w-2xl text-sm leading-relaxed sm:text-[15px]",
                dark ? "text-cream-100/60" : "text-muted",
              )}
            >
              {description}
            </p>
          )}
        </div>
        {children && <div className="mt-6">{children}</div>}
      </Container>
    </section>
  );
}
