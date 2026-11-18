import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";

/** Storefront routes only — admin and account pages are intentionally omitted. */
export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const routes = [
    "",
    "/about",
    "/books",
    "/categories",
    "/search",
    "/best-sellers",
    "/new-books",
    "/viral-books",
    "/trending",
    "/up-sales",
    "/audio-books",
    "/authors",
    "/publishers",
    "/used-books",
    "/sell-used-books",
    "/free-order",
    "/wholesale",
    "/stories",
    "/stories/share",
    "/reviews",
    "/video",
    "/quiz",
    "/sunnah",
    "/sunnah-items",
    "/international-books",
    "/student-books",
    "/blogs",
    "/contact",
    "/privacy",
    "/terms",
    "/return-policy",
  ];
  return routes.map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
