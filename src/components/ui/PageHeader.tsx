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
          ? "hero-mesh border-brand-700 text-white"
          : "border-line bg-white text-ink",
        className,
      )}
    >
      {!dark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute right-0 top-0 h-full w-1/2 bg-gradient-to-l from-brand-50/70 to-transparent"
        />
      )}
      {dark && (
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-24 -top-32 h-80 w-80 rounded-full border border-white/10"
        />
      )}

      <Container className="relative py-7 sm:py-10 lg:py-12">
        {crumbs && <Breadcrumb items={crumbs} light={dark} className="mb-4" />}
        <div className="max-w-3xl">
          {eyebrow && (
            <span
              className={cn(
                "mb-2 block text-[11px] font-medium uppercase tracking-[0.08em]",
                dark ? "text-brand-200" : "text-brand-600",
              )}
            >
              {eyebrow}
            </span>
          )}
          <h1
            className={cn(
              "text-3xl font-bold leading-[1.16] tracking-tight sm:text-4xl lg:text-[2.6rem]",
              dark ? "text-white" : "text-ink",
            )}
          >
            {title}
          </h1>
          {description && (
            <p
              className={cn(
                "mt-3 max-w-2xl text-sm leading-relaxed sm:text-[15px]",
                dark ? "text-white/70" : "text-muted",
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
