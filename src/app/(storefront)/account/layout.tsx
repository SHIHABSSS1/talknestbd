import type { Metadata } from "next";
import { Suspense } from "react";

import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AccountNav } from "@/components/account/AccountNav";
import { requireUser } from "@/lib/auth-guards";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your TalkNest BD account — orders, addresses, wishlist and profile settings.",
};

// Auth-gated segment: a redirect here cannot be an instant navigation.
export const instant = false;

async function AccountGuard({ children }: { children: React.ReactNode }) {
  await requireUser();
  return (
    <>
      <PageHeader
        eyebrow="My Account"
        title="My TalkNest account"
        description="Track orders, review saved addresses, manage your wishlist and update profile settings — all in one place."
        crumbs={[{ label: "My Account" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-5 lg:grid-cols-[250px_1fr] lg:items-start">
            <AccountNav />
            <div className="min-w-0">{children}</div>
          </div>
        </Container>
      </section>
    </>
  );
}

export default function AccountLayout({ children }: { children: React.ReactNode }) {
  return (
    <Suspense
      fallback={
        <div className="grid min-h-[50vh] place-items-center text-center text-[13px] text-muted">
          Checking your account…
        </div>
      }
    >
      <AccountGuard>{children}</AccountGuard>
    </Suspense>
  );
}
