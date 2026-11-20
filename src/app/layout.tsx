import type { Metadata, Viewport } from "next";
import { Roboto } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { CategoryContentProvider } from "@/components/providers/CategoryContentProvider";
import { getCategoryContent } from "@/lib/db/queries/categories";
import { getAuthorContent } from "@/lib/db/queries/authors";
import { getPublisherContent } from "@/lib/db/queries/publishers";
import { getUpSaleShelfContent } from "@/lib/db/queries/shelves";
import { getSellContent } from "@/lib/db/queries/sell";
import { getUsedContent } from "@/lib/db/queries/used";
import { BookContentProvider } from "@/components/providers/BookContentProvider";
import { ShelfContentProvider } from "@/components/providers/ShelfContentProvider";
import { SellContentProvider } from "@/components/providers/SellContentProvider";
import { SellRequestsProvider } from "@/components/providers/SellRequestsProvider";
import { UpSaleBooksProvider } from "@/components/providers/UpSaleBooksProvider";
import { UsedContentProvider } from "@/components/providers/UsedContentProvider";
import { NotificationsProvider } from "@/components/providers/NotificationsProvider";
import {
  WholesaleContentProvider,
  WholesaleRequestsProvider,
} from "@/components/providers/WholesaleProviders";
import { AudioContentProvider } from "@/components/providers/AudioContentProvider";
import { AuthorContentProvider } from "@/components/providers/AuthorContentProvider";
import { PublisherContentProvider } from "@/components/providers/PublisherContentProvider";
import { ReviewsProvider } from "@/components/providers/ReviewsProvider";
import { VideoQuizProvider } from "@/components/providers/VideoQuizProvider";
import { StoriesProvider } from "@/components/providers/StoriesProvider";
import { SiteSettingsProvider } from "@/components/providers/SiteSettingsProvider";
import { SiteScripts } from "@/components/layout/SiteScripts";
import { SITE_URL } from "@/lib/site-url";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TalkNest BD â€” Books, Stories & Community",
    template: "%s | TalkNest BD",
  },
  description:
    "Discover bestselling books, new arrivals, audiobooks, used books, Islamic history and a community of readers â€” all in one place. TalkNest BD.",
  keywords: [
    "TalkNest BD",
    "online bookstore",
    "books in Bangladesh",
    "Bangla books",
    "Islamic books",
    "audiobooks",
    "used books",
    "sell used books",
  ],
  authors: [{ name: "TalkNest BD" }],
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    url: SITE_URL,
    title: "TalkNest BD â€” Books, Stories & Community",
    description:
      "Books, audiobooks, stories and a community of readers â€” all in one place.",
    type: "website",
    locale: "en_BD",
    siteName: "TalkNest BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkNest BD",
    description: "Books, stories and community, all in one place.",
  },
};

export const viewport: Viewport = {
  themeColor: "#1877f2",
  width: "device-width",
  initialScale: 1,
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  // Cached content block (content:categories); passed to the client provider so
  // every category surface shares one server-rendered source of truth.
  const [categoryContent, authorContent, publisherContent, upSale, sellContent, usedContent] =
    await Promise.all([
      getCategoryContent(),
      getAuthorContent(),
      getPublisherContent(),
      getUpSaleShelfContent(),
      getSellContent(),
      getUsedContent(),
    ]);

  return (
    <html lang="en" className={roboto.variable} data-scroll-behavior="smooth">
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[4px] focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <StoreProvider>
          <CategoryContentProvider initialContent={categoryContent}>
            <BookContentProvider>
                <ShelfContentProvider>
                  <SellContentProvider initialContent={sellContent}>
                    <SellRequestsProvider>
                      <UpSaleBooksProvider initialBooks={upSale.books}>
                        <UsedContentProvider initialContent={usedContent}>
                          <NotificationsProvider>
                            <WholesaleContentProvider>
                              <WholesaleRequestsProvider>
                                <AudioContentProvider>
                                  <AuthorContentProvider initialContent={authorContent}>
                                    <PublisherContentProvider initialContent={publisherContent}>
                                      <ReviewsProvider>
                                        <VideoQuizProvider>
                                          <StoriesProvider>
                                            <SiteSettingsProvider>
                                              <SiteScripts />
                                              {children}
                                            </SiteSettingsProvider>
                                          </StoriesProvider>
                                        </VideoQuizProvider>
                                      </ReviewsProvider>
                                    </PublisherContentProvider>
                                  </AuthorContentProvider>
                                </AudioContentProvider>
                              </WholesaleRequestsProvider>
                            </WholesaleContentProvider>
                          </NotificationsProvider>
                        </UsedContentProvider>
                      </UpSaleBooksProvider>
                    </SellRequestsProvider>
                  </SellContentProvider>
                </ShelfContentProvider>
            </BookContentProvider>
          </CategoryContentProvider>
        </StoreProvider>
      </body>
    </html>
  );
}
