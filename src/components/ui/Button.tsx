import Link from "next/link";
import type { ButtonHTMLAttributes, ReactNode } from "react";
import { cn } from "@/lib/utils";

type Variant = "primary" | "gold" | "outline" | "light" | "ghost" | "clay";
type Size = "sm" | "md" | "lg";

const variants: Record<Variant, string> = {
  primary:
    "bg-forest-900 text-cream-50 hover:bg-forest-800 shadow-[0_12px_24px_-14px_rgba(10,33,24,0.7)]",
  gold: "bg-gold-500 text-forest-950 hover:bg-gold-400 shadow-[0_12px_24px_-14px_rgba(169,131,54,0.8)]",
  outline:
    "border border-forest-900/20 bg-transparent text-forest-900 hover:border-forest-900 hover:bg-forest-900 hover:text-cream-50",
  light:
    "border border-white/20 bg-white/10 text-cream-50 backdrop-blur hover:bg-white/20",
  ghost: "bg-transparent text-forest-900 hover:bg-forest-50",
  clay: "bg-clay-500 text-cream-50 hover:bg-clay-600",
};

const sizes: Record<Size, string> = {
  sm: "h-9 px-4 text-xs",
  md: "h-11 px-5 text-sm",
  lg: "h-12 px-6 text-sm sm:h-13 sm:px-7 sm:text-base",
};

interface ButtonProps extends Omit<ButtonHTMLAttributes<HTMLButtonElement>, "className"> {
  children: ReactNode;
  href?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
  target?: string;
  rel?: string;
}

export function Button({
  children,
  href,
  variant = "primary",
  size = "md",
  className,
  type = "button",
  ...rest
}: ButtonProps) {
  const classes = cn(
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-full font-semibold transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-500 focus-visible:ring-offset-2 focus-visible:ring-offset-cream-50 disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    sizes[size],
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes} target={rest.target} rel={rest.rel}>
        {children}
      </Link>
    );
  }

  return (
    <button type={type} className={classes} {...rest}>
      {children}
    </button>
  );
}
