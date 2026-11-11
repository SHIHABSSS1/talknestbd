import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { WishlistView } from "@/components/account/WishlistView";

export const metadata: Metadata = {
  title: "আমার উইশলিস্ট",
  description: "TalkNest BD-তে আপনার সংরক্ষিত প্রিয় বইয়ের তালিকা।",
};

export default function WishlistPage() {
  return (
    <>
      <PageHeader
        eyebrow="My Wishlist"
        title="যে বইগুলো পড়তে চান"
        description="হার্ট আইকনে সংরক্ষিত বইগুলো এখানে — যখন খুশি কার্টে যোগ করে অর্ডার করুন।"
        crumbs={[{ label: "উইশলিস্ট" }]}
      />
      <section className="py-8 sm:py-10">
        <Container>
          <WishlistView />
        </Container>
      </section>
    </>
  );
}
