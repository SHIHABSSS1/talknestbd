import type { Book } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { ViewAllRow } from "@/components/ui/ViewAllRow";
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
        "border-b border-line py-8 sm:py-10",
        tone === "soft" ? "bg-canvas" : "bg-white",
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
          className="mb-6 sm:mb-7"
        />
        <BookGrid books={books.slice(0, 6)} columns="six" />
        {href && (
          <ViewAllRow
            href={href}
            label={linkLabel ?? "View all"}
            count={`${books.length} titles`}
          />
        )}
      </Container>
    </section>
  );
}
