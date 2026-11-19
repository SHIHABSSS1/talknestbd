import type { Metadata } from "next";
import { AdminLoginForm } from "@/components/admin/AdminLoginForm";

export const metadata: Metadata = {
  title: "Admin Sign In",
  description: "Sign in to the TalkNest BD admin panel.",
  robots: { index: false, follow: false },
};

export default function AdminLoginPage() {
  return (
    <main id="main-content" className="brand-wash min-h-screen px-4 py-8 sm:px-6 sm:py-12">
      <AdminLoginForm />
    </main>
  );
}
