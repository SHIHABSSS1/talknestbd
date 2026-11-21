import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site-url";
import { getPublishedVideos } from "@/lib/db/queries/video-quiz";

/** Storefront routes only — admin and account pages are intentionally omitted. */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const publishedVideos = await getPublishedVideos();
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
  const videoRoutes = publishedVideos.map((video) => `/videos/${video.slug}`);
  return [...routes, ...videoRoutes].map((path) => ({
    url: `${SITE_URL}${path || "/"}`,
    lastModified: now,
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : 0.7,
  }));
}
