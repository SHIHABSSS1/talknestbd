import type { Metadata } from "next";
import { Suspense } from "react";

import { AdminAccessProvider } from "@/components/providers/AdminAccessProvider";
import { AdminShell } from "@/components/admin/AdminShell";
import { requireAdmin } from "@/lib/auth-guards";

// Auth-gated segment: requireAdmin() redirects during prefetch, so neither this
// layout nor the pages beneath it can produce an instant UI. Both opt out —
// see node_modules/next/dist/docs/.../route-segment-config/instant.md.
export const instant = false;

export const metadata: Metadata = {
  title: {
    default: "Admin Panel",
    template: "%s | Admin — TalkNest BD",
  },
  description: "TalkNest BD admin panel — manage sections, books and content.",
};

async function AdminGuard({ children }: { children: React.ReactNode }) {
  await requireAdmin();
  return (
    <AdminAccessProvider>
      <AdminShell>{children}</AdminShell>
    </AdminAccessProvider>
  );
}

export default function AdminPanelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Suspense
      fallback={
        <div className="brand-wash grid min-h-screen place-items-center px-4 text-center text-[13px] text-muted">
          Checking admin access…
        </div>
      }
    >
      <AdminGuard>{children}</AdminGuard>
    </Suspense>
  );
}
