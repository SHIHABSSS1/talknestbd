import type { Metadata, Viewport } from "next";
import { Suspense } from "react";
import { Anek_Bangla, Tiro_Bangla } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import { Header } from "@/components/layout/Header";
import { HeaderSkeleton } from "@/components/layout/HeaderSkeleton";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { Toast } from "@/components/layout/Toast";
import "./globals.css";

const bodyFont = Anek_Bangla({
  subsets: ["bengali", "latin"],
  weight: "variable",
  variable: "--font-bengali-body",
  display: "swap",
});

const displayFont = Tiro_Bangla({
  subsets: ["bengali", "latin"],
  weight: "400",
  variable: "--font-bengali-display",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "TalkNest BD — বাংলাদেশের প্রিয় বইয়ের নীড়",
    template: "%s | TalkNest BD",
  },
  description:
    "বাংলা বই, ইসলামিক ইতিহাস, অডিও বুক, পুরাতন বই, সুন্নাহ সামগ্রী, লেখক ও পাঠকের কমিউনিটি — সব এক জায়গায়। TalkNest BD",
  keywords: [
    "TalkNest BD",
    "বাংলা বই",
    "অনলাইন বইঘর",
    "ইসলামিক বই",
    "অডিও বুক",
    "পুরাতন বই",
    "বই ফেরত",
    "বাংলাদেশ বইয়ের দোকান",
  ],
  authors: [{ name: "TalkNest BD" }],
  openGraph: {
    title: "TalkNest BD — বাংলাদেশের প্রিয় বইয়ের নীড়",
    description:
      "বই, গল্প, অডিও আর পাঠকের কমিউনিটি — সব এক জায়গায়।",
    type: "website",
    locale: "bn_BD",
    siteName: "TalkNest BD",
  },
  twitter: {
    card: "summary_large_image",
    title: "TalkNest BD",
    description: "বাংলাদেশের প্রিয় বইয়ের নীড়",
  },
};

export const viewport: Viewport = {
  themeColor: "#0a2118",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="bn" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body className="min-h-screen bg-cream-50 font-sans text-ink antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[200] focus:rounded-full focus:bg-forest-950 focus:px-5 focus:py-3 focus:text-sm focus:text-cream-50"
        >
          মূল কনটেন্টে যান
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
                className="print-hide fixed inset-x-0 bottom-0 z-50 h-15 border-t border-forest-900/10 bg-cream-50/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-lg md:hidden"
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
