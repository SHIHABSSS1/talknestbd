"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { formatCount } from "@/lib/utils";
import { booksForTile, subcategoryBooks } from "@/lib/category-books";
import { Container } from "@/components/ui/Container";
import { CategoryIcon } from "@/components/ui/CategoryIcon";
import { useCategoryContent } from "@/components/providers/CategoryContentProvider";

/**
 * Category grid for the /categories page. Uses the same editable tiles as the
 * homepage showcase, but renders the larger category-page card design.
 */
export function CategoryCards() {
  const { content } = useCategoryContent();
  if (content.tiles.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <Container>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {content.tiles.map((tile) => {
            const tileBooks = booksForTile(tile);
            return (
              <Link
                key={tile.id}
                href={tile.href || "/categories"}
                className="group relative overflow-hidden rounded-[8px] border border-line bg-white p-5 transition-colors duration-200 hover:border-brand-300 sm:p-6"
              >
                <div
                  aria-hidden="true"
                  className="absolute -right-10 -top-12 h-32 w-32 rounded-full border border-forest-900/10"
                />
                <div className="flex items-start justify-between gap-3">
                  <span
                    className="grid h-11 w-11 place-items-center overflow-hidden rounded-[4px] text-lg font-bold text-white"
                    style={{ backgroundColor: tile.accent }}
                  >
                    {tile.src ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={tile.src} alt="" className="h-full w-full object-cover" />
                    ) : tile.audio ? (
                      <CategoryIcon icon={tile.icon} size={20} className="text-white" />
                    ) : (
                      tile.name.charAt(0)
                    )}
                  </span>
                  <ArrowUpRight
                    size={18}
                    className="text-muted/50 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand-600"
                  />
                </div>
                <p className="mt-5 text-[10px] font-medium uppercase tracking-[0.1em] text-muted">
                  {tile.englishName}
                </p>
                <h2 className="mt-1 text-xl font-bold text-ink">{tile.name}</h2>
                <p className="mt-2 text-xs leading-relaxed text-muted">
                  {tile.description}
                </p>
                {tile.subcategories.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-1.5">
                    {tile.subcategories.map((sub) => (
                      <span
                        key={sub.id}
                        className="rounded-full border border-line bg-canvas px-2 py-0.5 text-[9px] text-muted"
                      >
                        {sub.name} · {subcategoryBooks(tile, sub).length}
                      </span>
                    ))}
                  </div>
                )}
                <div className="mt-4 flex items-center justify-between border-t border-line pt-3 text-[11px]">
                  <span className="font-medium text-brand-700">
                    {formatCount(tileBooks.length)} {tile.audio ? "audio titles" : "books"}
                  </span>
                  <span className="flex -space-x-3">
                    {tileBooks.slice(0, 3).map((book) => (
                      <span
                        key={book.slug}
                        className="h-7 w-5 rounded-[2px] border border-white shadow-sm"
                        style={{
                          background: `linear-gradient(145deg, ${book.cover.from}, ${book.cover.to})`,
                        }}
                      />
                    ))}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
