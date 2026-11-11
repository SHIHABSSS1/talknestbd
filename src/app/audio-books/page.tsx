import type { Metadata } from "next";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { AudioLibrary } from "@/components/audio/AudioLibrary";

export const metadata: Metadata = {
  title: "অডিও বুক",
  description:
    "TalkNest BD-এর অডিও বুক লাইব্রেরি — কিছু বই সম্পূর্ণ ফ্রি, প্রথম অধ্যায় ফ্রি প্রিভিউ এবং বাকিগুলো আনলক করে শুনুন।",
};

export default function AudioBooksPage() {
  return (
    <>
      <PageHeader
        eyebrow="TalkNest Audio"
        title="চোখ ব্যস্ত থাকুক, গল্প শুনুন কানে"
        description="দুইটি অডিও বুক সম্পূর্ণ ফ্রি। প্রতিটি প্রিমিয়াম অডিও বুকের প্রথম অধ্যায় ফ্রি প্রিভিউ হিসেবে শোনা যায় — পুরো বই শুনতে অডিও বুকটি আনলক করুন।"
        tone="dark"
        crumbs={[{ label: "অডিও বুক" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            ২টি সম্পূর্ণ ফ্রি
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            প্রথম অধ্যায় ফ্রি প্রিভিউ
          </span>
          <span className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-cream-100/80">
            একবার কিনলে চিরকাল শোনা
          </span>
        </div>
      </PageHeader>
      <section className="py-8 sm:py-10">
        <Container>
          <AudioLibrary />
        </Container>
      </section>
    </>
  );
}
