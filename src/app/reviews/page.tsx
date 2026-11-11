import type { Metadata } from "next";
import { HeartHandshake, MessageSquareHeart, Star } from "lucide-react";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { ReviewsExplorer } from "@/components/reviews/ReviewsExplorer";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "কাস্টমার রিভিউ",
  description:
    "TalkNest BD পাঠকদের সত্যিকারের অভিজ্ঞতা — বই, ডেলিভারি, প্যাকেজিং ও সেবার রিভিউ পড়ুন অথবা নিজের মতামত জানান।",
};

export default function ReviewsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Reader Reviews"
        title="পাঠকদের কথা, আমাদের অঙ্গীকার"
        description="প্রতিটি রিভিউ আমাদের শেখায়, প্রতিটি মতামত পরের বইটি আরও ভালো করে। বই কেনার আগে অন্য পাঠকের অভিজ্ঞতা জেনে নিন, আবার নিজের অনুভূতিও শেয়ার করুন।"
        crumbs={[{ label: "কাস্টমার রিভিউ" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            <Star size={11} className="fill-gold-500 text-gold-500" />
            {toBn(1240)}+ ভেরিফায়েড রিভিউ
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            <HeartHandshake size={11} /> গড় রেটিং ৪.৯
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            <MessageSquareHeart size={11} /> ১০০% পাঠকের মতামত
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <ReviewsExplorer />
        </Container>
      </section>
    </>
  );
}
