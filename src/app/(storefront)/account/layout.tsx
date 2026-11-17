import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AccountNav } from "@/components/account/AccountNav";

export const metadata: Metadata = {
  title: "My Account",
  description: "Your TalkNest BD account — orders, addresses, wishlist and profile settings.",
};

export default function AccountLayout({ children }: { children: React.ReactNode }) {
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
