import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sunnahItems } from "@/data/sunnah";
import { SunnahItemCard } from "@/components/sunnah/SunnahItemCard";

export function SunnahShowcase() {
  return (
    <section className="bg-cream-100/70 py-10 sm:py-14">
      <Container>
        <SectionHeader
          eyebrow="দৈনন্দিন সুন্নাহ"
          title="প্রতিদিনের ছোট ছোট সুন্নাহ"
          description="মিসওয়াক, আতর, তাসবিহ আর জায়নামাজ — যত্নে বাছাই করা সুন্নাহ সামগ্রী।"
          href="/sunnah-items"
          linkLabel="সব সামগ্রী"
        />
        <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          {sunnahItems.slice(0, 4).map((item) => (
            <SunnahItemCard key={item.slug} item={item} />
          ))}
        </div>
      </Container>
    </section>
  );
}
