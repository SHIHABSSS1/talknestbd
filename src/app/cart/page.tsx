import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "My Cart",
  description: "Your selected books and Sunnah essentials at TalkNest BD.",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shopping Cart"
        title="Your selected books"
        description="Review the books in your cart, adjust quantities and continue to a secure checkout."
        crumbs={[{ label: "My Cart" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <CartView />
        </Container>
      </section>
    </>
  );
}
