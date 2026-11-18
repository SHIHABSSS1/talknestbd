/** Public base URL used for sitemap and canonical metadata.
 * Override at build time with NEXT_PUBLIC_SITE_URL. */
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ?? "https://talknestbd.com"
).replace(/\/$/, "");
