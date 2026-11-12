import type { Metadata } from "next";
import { BadgeCheck, HeartHandshake, Sparkles, Truck } from "lucide-react";
import { sunnahItems } from "@/data/sunnah";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";
import { SunnahItemCard } from "@/components/sunnah/SunnahItemCard";

export const metadata: Metadata = {
  title: "Sunnah Essentials",
  description:
    "Miswak, tasbih, attar, prayer mats and Sunnah diaries — everyday Sunnah essentials from TalkNest BD.",
};

export default function SunnahItemsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Sunnah Essentials"
        title="Your everyday Sunnah companion"
        description="Curated essentials to help you follow the Sunnah of the Prophet ﷺ — carefully selected and delivered to your door in beautiful packaging."
        crumbs={[{ label: "Sunnah Essentials" }]}
      >
        <div className="flex flex-wrap gap-2 text-[10px]">
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            {sunnahItems.length} items
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            Free delivery on orders ৳999+
          </span>
          <span className="rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 font-medium text-forest-800">
            Gift packing available
          </span>
        </div>
      </PageHeader>

      <section className="py-8 sm:py-12">
        <Container>
          <div className="mb-5 grid gap-2 sm:grid-cols-3">
            {[
              { icon: BadgeCheck, title: "Verified essentials", text: "Every product is hand-picked" },
              { icon: Truck, title: "Nationwide delivery", text: "2–4 days in Dhaka, 3–7 business days outside" },
              { icon: HeartHandshake, title: "Gift packing", text: "A beautiful box for someone special" },
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
                  Build a Sunnah gift pack
                </p>
                <p className="mt-0.5 text-[10px] text-muted">
                  Miswak, attar and tasbih together — in a beautiful box to gift someone special.
                </p>
              </div>
            </div>
            <a
              href="https://wa.me/8801712345678"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-9 shrink-0 items-center rounded-full bg-forest-900 px-4 text-[10px] font-semibold text-cream-50 hover:bg-forest-700"
            >
              Order on WhatsApp
            </a>
          </div>
        </Container>
      </section>
    </>
  );
}
