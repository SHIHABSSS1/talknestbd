import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CheckoutForm } from "@/components/checkout/CheckoutForm";

export const metadata: Metadata = {
  title: "চেকআউট",
  description: "TalkNest BD-তে আপনার অর্ডারের ঠিকানা, ডেলিভারি ও পেমেন্ট পদ্ধতি বেছে নিন।",
};

export default function CheckoutPage() {
  return (
    <>
      <PageHeader
        eyebrow="Secure Checkout"
        title="অর্ডার সম্পন্ন করুন"
        description="ঠিকানা, ডেলিভারি ও পেমেন্ট পদ্ধতি বেছে নিন। এটি একটি ডেমো চেকআউট — কোনো আসল পেমেন্ট নেওয়া হয় না।"
        crumbs={[{ label: "কার্ট", href: "/cart" }, { label: "চেকআউট" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <CheckoutForm />
        </Container>
      </section>
    </>
  );
}
