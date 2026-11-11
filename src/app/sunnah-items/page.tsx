import type { Metadata } from "next";
import { BadgeCheck, HeartHandshake, Sparkles, Truck } from "lucide-react";
import { sunnahItems } from "@/data/sunnah";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SunnahItemCard } from "@/components/sunnah/SunnahItemCard";
import { toBn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "সুন্নাহ সামগ্রী",
  description:
    "মিসওয়াক, তাসবিহ, আতর, জায়নামাজ ও সুন্নাহ ডায়েরিসহ দৈনন্দিন সুন্নাহ চর্চার সামগ্রী — TalkNest BD।",
};

export default function SunnahItemsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sunnah Essentials"
        title="দৈনন্দিন সুন্নাহর সঙ্গী"
        description="রাসূলুল্লাহ ﷺ-এর সুন্নাহ অনুসরণে সহায়ক বাছাই করা সামগ্রী — যত্নের সঙ্গে বেছে নেওয়া, সুন্দর প্যাকেজিংয়ে আপনার দরজায়।"
        crumbs={[{ label: "সুন্নাহ সামগ্রী" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            {toBn(sunnahItems.length)}টি সামগ্রী
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            ৳৯৯৯+ অর্ডারে ফ্রি ডেলিভারি
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            উপহার প্যাকিং সুবিধা
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            {[
              { icon: BadgeCheck, title: "যাচাই করা সামগ্রী", text: "প্রতিটি পণ্য হাতে দেখে বাছাই করা" },
              { icon: Truck, title: "সারাদেশে ডেলিভারি", text: "ঢাকায় ২–৪, বাইরে ৩–৭ কর্মদিবস" },
              { icon: HeartHandshake, title: "উপহার প্যাকিং", text: "প্রিয়জনকে দেওয়ার জন্য সুন্দর বক্স" },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-2.5 rounded-2xl border border-forest-900/8 bg-cream-50 px-4 py-3"
              >
                <item.icon size={16} className="mt-0.5 shrink-0 text-forest-600" />
                <div>
                  <p className="text-[11px] font-semibold text-forest-950">{item.title}</p>
                  <p className="text-[9px] text-muted">{item.text}</p>
                </div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            {sunnahItems.map((item) => (
              <SunnahItemCard key={item.slug} item={item} />
            ))}
          </div>

          <div className="mt-8 flex flex-col items-center justify-between gap-3 rounded-3xl border border-gold-500/20 bg-gold-500/8 px-5 py-5 sm:flex-row">
            <div className="flex items-start gap-2.5">
              <Sparkles size={18} className="mt-0.5 shrink-0 text-gold-600" />
              <div>
                <p className="text-xs font-semibold text-forest-950">
                  সুন্নাহ গিফট প্যাক বানিয়ে দিন
                </p>
                <p className="mt-0.5 text-[10px] text-muted">
                  মিসওয়াক, আতর, তাসবিহ একসঙ্গে — প্রিয়জনকে উপহার দেওয়ার জন্য সুন্দর বক্সে।
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center rounded-full bg-forest-900 px-4 text-[10px] font-semibold text-cream-50 hover:bg-forest-700"
            >
              হোয়াটসঅ্যাপে অর্ডার
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
