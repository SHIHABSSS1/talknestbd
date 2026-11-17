import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { ArrowLeft, Construction } from "lucide-react";
import { findAdminNavItem } from "@/lib/admin-nav";

export const metadata: Metadata = {
  title: "Admin page",
};

function humanize(segment: string) {
  return segment
    .split("-")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

function PlaceholderSkeleton() {
  return (
    <div className="mx-auto max-w-3xl">
      <div className="mt-4 h-64 animate-pulse rounded-[10px] border border-line bg-white" />
    </div>
  );
}

async function PlaceholderContent({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  const { slug } = await params;
  const href = `/admin/${slug.join("/")}`;
  const label =
    findAdminNavItem(href)?.label ?? humanize(slug[slug.length - 1] ?? "Page");

  return (
    <section className="mx-auto max-w-3xl">
      <Link
        href="/admin"
        className="inline-flex items-center gap-1.5 text-[11px] font-medium text-muted transition-colors hover:text-brand-700"
      >
        <ArrowLeft size={13} /> Back to dashboard
      </Link>

      <div className="mt-4 rounded-[10px] border border-line bg-white p-6 sm:p-8">
        <span className="grid h-11 w-11 place-items-center rounded-[9px] bg-brand-50 text-brand-700">
          <Construction size={20} />
        </span>
        <h1 className="mt-4 font-display text-2xl font-bold text-ink">{label}</h1>
        <p className="mt-2 max-w-xl text-[13px] leading-relaxed text-muted">
          This page is part of the admin roadmap. The editor will be added in an
          upcoming task — the navigation and page structure are already in place.
        </p>

        <div className="mt-6 rounded-[8px] border border-brand-100 bg-brand-50 px-4 py-3">
          <p className="text-[10px] leading-relaxed text-brand-800">
            <span className="font-semibold">Demo notice:</span> even after the
            editor is added, data will be saved in this browser only — there is
            no server or real payment flow.
          </p>
        </div>
      </div>
    </section>
  );
}

export default function AdminPlaceholderPage({
  params,
}: {
  params: Promise<{ slug: string[] }>;
}) {
  return (
    <Suspense fallback={<PlaceholderSkeleton />}>
      <PlaceholderContent params={params} />
    </Suspense>
  );
}
