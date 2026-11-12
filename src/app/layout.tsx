import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Roboto } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { HeaderSkeleton } from "@/components/layout/HeaderSkeleton";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toast } from "@/components/layout/Toast";
import "./globals.css";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TalkNest BD — Books, Stories & Community",
    template: "%s | TalkNest BD",
  },
  description:
    "Discover bestselling books, new arrivals, audiobooks, used books, Islamic history and a community of readers — all in one place. TalkNest BD.",
  keywords: [
    "TalkNest BD",
    "online bookstore",
    "books in Bangladesh",
    "Bangla books",
    "Islamic books",
    "audiobooks",
    "used books",
    "book buyback",
  ],
  authors: [{ name: "TalkNest BD" }],
  openGraph: {
    title: "TalkNest BD — Books, Stories & Community",
    description:
      "Books, audiobooks, stories and a community of readers — all in one place.",
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

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={roboto.variable}>
      <body className="min-h-screen bg-canvas font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-[4px] focus:bg-brand-700 focus:px-5 focus:py-3 focus:text-sm focus:font-medium focus:text-white"
        >
          Skip to main content
        </a>
        <StoreProvider>
          <Suspense fallback={<HeaderSkeleton />}>
            <Header />
          </Suspense>
          <main id="main-content">{children}</main>
          <Footer />
          <Suspense
            fallback={
              <div
                aria-hidden="true"
                className="print-hide fixed inset-x-0 bottom-0 z-50 h-15 border-t border-line bg-surface/95 pb-[env(safe-area-inset-bottom)] md:hidden"
              />
            }
          >
            <MobileBottomNav />
          </Suspense>
          <Toast />
        </StoreProvider>
      </body>
    </html>
  );
}
