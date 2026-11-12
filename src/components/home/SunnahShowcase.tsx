import { Container } from "@/components/ui/Container";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { sunnahItems } from "@/data/sunnah";
import { SunnahItemCard } from "@/components/sunnah/SunnahItemCard";

export function SunnahShowcase() {
  return (
    <section className="bg-canvas py-8 sm:py-10">
      <Container>
        <SectionHeader
          eyebrow="Sunnah essentials"
          title="Small Sunnah, every day"
          description="Miswak, attar, tasbih and prayer mats — a considered collection for daily practice."
          href="/sunnah-items"
          linkLabel="All essentials"
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
