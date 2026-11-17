import { Suspense } from "react";
import { Header } from "@/components/layout/Header";
import { HeaderSkeleton } from "@/components/layout/HeaderSkeleton";
import { Footer } from "@/components/layout/Footer";
import { MobileBottomNav } from "@/components/layout/MobileBottomNav";
import { LiveChatDock } from "@/components/layout/LiveChatDock";
import { Toast } from "@/components/layout/Toast";

export default function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
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
      <LiveChatDock />
      <Toast />
    </>
  );
}
