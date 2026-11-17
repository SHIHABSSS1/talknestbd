"use client";

import { Suspense, useCallback, useState } from "react";
import { AdminSidebar } from "./AdminSidebar";
import { AdminHeader } from "./AdminHeader";
import { AdminFooter } from "./AdminFooter";

function SidebarPlaceholder() {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-y-0 left-0 z-50 hidden w-64 border-r border-line bg-white lg:block"
    />
  );
}

export function AdminShell({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const openSidebar = useCallback(() => setSidebarOpen(true), []);
  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  return (
    <div className="min-h-screen bg-[#f4f7fb] text-ink">
      <Suspense fallback={<SidebarPlaceholder />}>
        <AdminSidebar open={sidebarOpen} onClose={closeSidebar} />
      </Suspense>
      <div className="lg:pl-64">
        <AdminHeader onMenuClick={openSidebar} />
        <main id="main-content" className="min-h-[70vh] p-4 sm:p-6">
          {children}
        </main>
        <AdminFooter />
      </div>
    </div>
  );
}
