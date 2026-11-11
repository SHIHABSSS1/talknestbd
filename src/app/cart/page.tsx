import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { CartView } from "@/components/cart/CartView";

export const metadata: Metadata = {
  title: "আমার কার্ট",
  description: "TalkNest BD-তে আপনার নির্বাচিত বই ও সুন্নাহ সামগ্রীর কার্ট।",
};

export default function CartPage() {
  return (
    <>
      <PageHeader
        eyebrow="Shopping Cart"
        title="আপনার নির্বাচিত বইগুলো"
        description="কার্টের বইগুলো দেখে নিন, পরিমাণ বদলান — তারপর নিরাপদে চেকআউট করুন।"
        crumbs={[{ label: "আমার কার্ট" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <CartView />
        </Container>
      </section>
    </>
  );
}
