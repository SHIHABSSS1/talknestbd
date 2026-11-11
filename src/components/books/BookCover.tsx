import type { BookCoverTheme, CoverMotif } from "@/lib/types";
import { cn } from "@/lib/utils";

export interface BookCoverData {
  title: string;
  subtitle?: string;
  author: string;
  publisher: string;
  cover: BookCoverTheme;
}

const sizeStyles = {
  sm: {
    inner: "p-3",
    brand: "text-[6px] tracking-[0.18em]",
    title: "text-[12px] leading-[1.25] line-clamp-3",
    author: "text-[8px]",
    publisher: "text-[7px]",
    rule: "w-5 mb-2",
  },
  md: {
    inner: "p-4 sm:p-5",
    brand: "text-[7px] tracking-[0.2em]",
    title: "text-base leading-[1.3] line-clamp-4 sm:text-lg",
    author: "text-[10px] sm:text-[11px]",
    publisher: "text-[8px] sm:text-[9px]",
    rule: "w-7 mb-3",
  },
  lg: {
    inner: "p-6 sm:p-8 lg:p-9",
    brand: "text-[9px] tracking-[0.24em]",
    title: "text-2xl leading-tight line-clamp-5 sm:text-3xl lg:text-[2.65rem]",
    author: "text-xs sm:text-sm",
    publisher: "text-[10px] sm:text-xs",
    rule: "w-10 mb-4",
  },
};

function CoverMotif({ motif, accent }: { motif: CoverMotif; accent: string }) {
  if (motif === "arch") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-[18%] top-[12%] h-[62%] w-[64%] rounded-t-full border"
          style={{ borderColor: `${accent}55`, borderWidth: 1.5 }}
        />
        <div
          className="absolute -right-[9%] top-[22%] h-[48%] w-[46%] rounded-t-full border"
          style={{ borderColor: `${accent}33`, borderWidth: 1 }}
        />
        <div
          className="absolute bottom-[18%] left-[10%] h-16 w-16 rounded-full blur-2xl"
          style={{ backgroundColor: `${accent}22` }}
        />
      </div>
    );
  }

  if (motif === "circle") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-12 top-8 h-40 w-40 rounded-full border-[10px] opacity-30 sm:-right-14 sm:h-48 sm:w-48"
          style={{ borderColor: accent }}
        />
        <div
          className="absolute -right-4 top-16 h-24 w-24 rounded-full border opacity-30"
          style={{ borderColor: accent }}
        />
        <div
          className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full opacity-20"
          style={{ backgroundColor: accent }}
        />
      </div>
    );
  }

  if (motif === "lines") {
    return (
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-20"
        style={{
          backgroundImage: `repeating-linear-gradient(115deg, ${accent} 0px, ${accent} 1px, transparent 1px, transparent 16px)`,
          maskImage: "linear-gradient(180deg, transparent 2%, black 46%, transparent 96%)",
          WebkitMaskImage: "linear-gradient(180deg, transparent 2%, black 46%, transparent 96%)",
        }}
      />
    );
  }

  if (motif === "star") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -right-6 top-9 h-28 w-28 rotate-45 border opacity-25"
          style={{ borderColor: accent }}
        />
        <div
          className="absolute -right-1 top-14 h-20 w-20 rotate-12 border opacity-25"
          style={{ borderColor: accent }}
        />
        <span
          className="absolute right-12 top-20 block h-2 w-2 rotate-45"
          style={{ backgroundColor: `${accent}88` }}
        />
      </div>
    );
  }

  if (motif === "wave") {
    return (
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <div
          className="absolute -bottom-20 -left-16 h-48 w-48 rounded-full border opacity-25"
          style={{ borderColor: accent, borderWidth: 1.5 }}
        />
        <div
          className="absolute -bottom-12 -left-8 h-32 w-32 rounded-full border opacity-25"
          style={{ borderColor: accent, borderWidth: 1 }}
        />
        <div
          className="absolute -bottom-4 left-0 h-16 w-16 rounded-full border opacity-20"
          style={{ borderColor: accent, borderWidth: 1 }}
        />
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 opacity-[0.18]"
      style={{
        backgroundImage: `linear-gradient(${accent} 1px, transparent 1px), linear-gradient(90deg, ${accent} 1px, transparent 1px)`,
        backgroundSize: "22px 22px",
        maskImage: "linear-gradient(180deg, transparent, black 38%, transparent 92%)",
        WebkitMaskImage: "linear-gradient(180deg, transparent, black 38%, transparent 92%)",
      }}
    />
  );
}

export function BookCover({
  book,
  size = "md",
  className,
}: {
  book: BookCoverData;
  size?: keyof typeof sizeStyles;
  className?: string;
}) {
  const styles = sizeStyles[size];

  return (
    <div
      className={cn(
        "relative isolate h-full w-full overflow-hidden rounded-[5px] book-shadow",
        className,
      )}
      style={{
        background: `linear-gradient(148deg, ${book.cover.from} 0%, ${book.cover.to} 100%)`,
      }}
    >
      <div aria-hidden="true" className="absolute inset-y-0 left-0 w-[5%] bg-black/20" />
      <div
        aria-hidden="true"
        className="absolute inset-y-0 left-[5%] w-px"
        style={{ backgroundColor: `${book.cover.accent}55` }}
      />
      <CoverMotif motif={book.cover.motif} accent={book.cover.accent} />

      <div className={cn("relative flex h-full flex-col", styles.inner)}>
        <div className="flex items-start justify-between gap-2">
          <span
            className={cn("font-medium uppercase text-white/55", styles.brand)}
          >
            TalkNest · BD
          </span>
          <span
            className="mt-0.5 block h-1.5 w-1.5 rounded-full"
            style={{ backgroundColor: book.cover.accent }}
          />
        </div>

        <div className="mt-auto">
          <span
            className={cn("block h-px", styles.rule)}
            style={{ backgroundColor: book.cover.accent }}
          />
          {book.subtitle && size !== "sm" && (
            <p
              className="mb-1.5 line-clamp-1 text-[8px] tracking-wide text-white/55 sm:text-[9px]"
              style={{ color: `${book.cover.accent}bb` }}
            >
              {book.subtitle}
            </p>
          )}
          <h3
            className={cn(
              "font-display font-semibold tracking-tight text-cream-50",
              styles.title,
            )}
          >
            {book.title}
          </h3>
          <p className={cn("mt-2 font-medium text-white/70", styles.author)}>
            {book.author}
          </p>
          <div className="mt-3 flex items-end justify-between gap-2 border-t border-white/10 pt-2">
            <span className={cn("line-clamp-1 text-white/45", styles.publisher)}>
              {book.publisher}
            </span>
            <span className={cn("text-white/35", styles.brand)}>TNB</span>
          </div>
        </div>
      </div>
    </div>
  );
}
