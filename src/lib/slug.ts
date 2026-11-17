/**
 * Small Unicode-aware slug helpers for admin-created categories.
 * Bengali (and other non-Latin) letters are preserved so localised names get
 * readable, working routes without manual URL editing.
 */
export function slugify(value: string): string {
  return (
    value
      .trim()
      .toLowerCase()
      .replace(/['’`"]/g, "")
      .replace(/[^\p{L}\p{N}]+/gu, "-")
      .replace(/^-+|-+$/g, "") || "category"
  );
}

/** Keeps generated slugs unique within a list (e.g. "novels-2"). */
export function uniqueSlug(base: string, used: string[]): string {
  const clean = slugify(base);
  if (!used.includes(clean)) return clean;
  let index = 2;
  while (used.includes(`${clean}-${index}`)) index += 1;
  return `${clean}-${index}`;
}

/** Route for a category tile, derived from its slug. */
export function categoryRoute(slug: string): string {
  return `/category/${slugify(slug)}`;
}
