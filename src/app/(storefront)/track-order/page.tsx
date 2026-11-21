import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { TrackOrderForm } from "@/components/orders/TrackOrderForm";

export const instant = false;

export const metadata: Metadata = {
  title: "Track Order",
  description: "Check the current status of your TalkNest BD order.",
};

export default async function TrackOrderPage({
  searchParams,
}: {
  searchParams: Promise<{ id?: string }>;
}) {
  const { id } = await searchParams;
  return (
    <>
      <PageHeader
        eyebrow="Order tracking"
        title="Track your order"
        description="Enter your order number and the email used at checkout to see its current status."
        crumbs={[{ label: "Track order" }]}
      />
      <section className="py-8 sm:py-10">
        <Container className="max-w-3xl">
          <TrackOrderForm initialId={id ?? ""} />
        </Container>
      </section>
    </>
  );
}
