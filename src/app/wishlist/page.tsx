import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { WishlistView } from "@/components/account/WishlistView";

export const metadata: Metadata = {
  title: "My Wishlist",
  description: "The books you have saved for later at TalkNest BD.",
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="My Wishlist"
        title="Books you want to read"
        description="Everything you have saved with the heart icon lives here — add it to your cart whenever you are ready."
        crumbs={[{ label: "Wishlist" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <WishlistView />
        </Container>
      </section>
    </>
  );
}
