import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Container } from "@/components/ui/Container";
import { OrderReceipt } from "@/components/orders/OrderReceipt";

export const metadata: Metadata = {
  title: "Order Receipt",
  description: "TalkNest BD order confirmation and receipt.",
};

export default function OrderReceiptPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <section className="bg-cream-100/40 py-8 sm:py-12">
      <Container className="max-w-4xl">
        <Suspense
          fallback={
            <div className="space-y-4">
              <div className="h-40 animate-pulse rounded-3xl bg-cream-100" />
              <div className="h-72 animate-pulse rounded-3xl bg-cream-100" />
            </div>
          }
        >
          <OrderReceiptContent params={params} />
        </Suspense>
      </Container>
    </section>
  );
}

async function OrderReceiptContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  if (!id) notFound();

  return <OrderReceipt orderId={id} />;
}
