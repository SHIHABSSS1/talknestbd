import Link from "next/link";

export function AdminFooter() {
  return (
    <footer className="border-t border-line bg-white">
      <div className="flex flex-col gap-2 px-4 py-4 text-[10px] text-muted sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>
          <span className="font-semibold text-ink">TalkNest BD Admin</span> · Demo panel.
          No real payments or server storage — changes stay in this browser.
        </p>
        <div className="flex items-center gap-4">
          <Link href="/" className="transition-colors hover:text-brand-700">
            Storefront
          </Link>
          <Link href="/admin/login" className="transition-colors hover:text-brand-700">
            Sign in
          </Link>
          <span>v1.0</span>
        </div>
      </div>
    </footer>
  );
}
