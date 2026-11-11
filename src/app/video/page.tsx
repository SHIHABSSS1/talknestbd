import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { VideoGallery } from "@/components/video/VideoGallery";

export const metadata: Metadata = {
  title: "TalkNest পডকাস্ট ও ভিডিও",
  description:
    "লেখক সাক্ষাৎকার, বই রিভিউ, বুক লিস্ট ও আড্ডা — TalkNest পডকাস্টের সব ভিডিও এক জায়গায়, YouTube প্লেয়ারসহ।",
};

export default function VideoPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Podcast"
        title="বই, লেখক আর গল্পের আড্ডা"
        description="প্রতি সপ্তাহে নতুন এপিসোড — লেখকের সঙ্গে সাক্ষাৎকার, বইয়ের রিভিউ, পাঠকের গল্প আর কুইজ। এপিসোডে ক্লিক করে সরাসরি YouTube প্লেয়ারে দেখুন।"
        tone="dark"
        crumbs={[{ label: "ভিডিও" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            নতুন এপিসোড প্রতি বৃহস্পতিবার
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            YouTube-এ সরাসরি প্লে
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            লেখক ও পাঠকের আড্ডা
          </span>
        </div>
      </PageHeader>
      <section className="py-8 sm:py-10">
        <Container>
          <VideoGallery />
        </Container>
      </section>
    </>
  );
}
