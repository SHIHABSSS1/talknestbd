import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose your delivery address, shipping method and payment option at TalkNest BD.",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Secure Checkout"
        title="Complete your order"
        description="Choose an address, delivery method and payment option. This is a demo checkout — no real payment is taken."
        crumbs={[{ label: "Cart", href: "/cart" }, { label: "Checkout" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <CheckoutForm />
        </Container>
      </section>
    </>
  );
}
