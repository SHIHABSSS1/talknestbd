import type { Metadata } from "next";
import { Mic } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { StoryShareForm } from "@/components/stories/StoryShareForm";

export const metadata: Metadata = {
  title: "গল্প শেয়ার করুন",
  description:
    "TalkNest-এর ‘Share to My Heart’ সেকশনে নিজের গল্প লিখে, ভয়েস রেকর্ড করে বা PDF ডায়েরি আপলোড করে শেয়ার করুন।",
};

export default function StorySharePage() {
  return (
    <>
      <PageHeader
        eyebrow="Share to My Heart"
        title="আপনার গল্পটা বলে ফেলুন"
        description="লেখা, কণ্ঠ বা ডায়েরি — যে মাধ্যমেই হোক, আপনার গল্পটা আমাদের কাছে পৌঁছে দিন। সম্পাদকীয় টিম যাচাই করে এটি পাঠক কমিউনিটির সঙ্গে শেয়ার করবে।"
        crumbs={[{ label: "হৃদয়ের গল্প", href: "/stories" }, { label: "গল্প শেয়ার" }]}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
          <Mic size={12} /> ভয়েস · লেখা · PDF
        </span>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container className="max-w-5xl">
          <StoryShareForm />
        </Container>
      </section>
    </>
  );
}
