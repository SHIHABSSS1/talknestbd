import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";
import { requireUser } from "@/lib/auth-guards";
import { Suspense } from "react";

export const instant = false;

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose your delivery address, shipping method and payment option at TalkNest BD.",
};

async function CheckoutContent() {
  await requireUser("/checkout");
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div className="min-h-[50vh]" />}>
      <CheckoutContent />
    </Suspense>
  );
}
