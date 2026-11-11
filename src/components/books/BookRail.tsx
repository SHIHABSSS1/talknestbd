import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { BookGrid } from "./BookGrid";

export function BookRail({
  books,
  eyebrow,
  title,
  description,
  href,
  linkLabel,
  className,
  tone = "default",
}: {
  books: Book[];
  eyebrow?: string;
  title: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  className?: string;
  tone?: "default" | "soft";
}) {
  return (
    <section
      className={cn(
        "py-9 sm:py-12",
        tone === "soft" && "bg-cream-100/60",
        className,
      )}
    >
      <Container>
        <SectionHeader
          eyebrow={eyebrow}
          title={title}
          description={description}
          href={href}
          linkLabel={linkLabel}
        />
        <BookGrid books={books.slice(0, 6)} columns="six" />
      </Container>
    </section>
  );
}
