// This page sits behind requireAdmin(); a redirect during prefetch is expected.
export const instant = false;

import type { Metadata } from "next";
import { Suspense } from "react";
import { AdminVideoQuizManager } from "@/components/admin/AdminVideoQuizManager";
import { getVideoQuizCopy } from "@/lib/db/queries/video-quiz";
import { findAdminNavItem } from "@/lib/admin-nav";

export const metadata: Metadata = { title: "Quiz management" };

export default async function AdminQuizzesPage() {
  const label = findAdminNavItem("/admin/quizzes")?.label ?? "Quizzes";
  const copy = await getVideoQuizCopy();
  return (
    <Suspense fallback={<p className="text-[12px] text-muted">Loading quizzes…</p>}>
      <AdminVideoQuizManager label={label} initialTab="quizzes" initialCopy={copy} />
    </Suspense>
  );
}
