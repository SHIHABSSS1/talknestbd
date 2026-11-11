import Link from "next/link";
import { FileText, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import type { LegalDocumentData } from "@/data/legal";
import { siteConfig } from "@/lib/utils";
import { PageHeader } from "@/components/ui/PageHeader";
import { Container } from "@/components/ui/Container";

export function LegalDocument({ document }: { document: LegalDocumentData }) {
  return (
    <>
      <PageHeader
        eyebrow={document.eyebrow}
        title={document.title}
        description={document.description}
        crumbs={[{ label: document.title }]}
      >
        <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-3 py-1.5 text-[10px] font-medium text-forest-800">
          <FileText size={12} />
          সর্বশেষ হালনাগাদ: {document.lastUpdated}
        </span>
      </PageHeader>

      <section className="py-8 sm:py-10">
        <Container>
          <div className="grid gap-6 lg:grid-cols-[260px_1fr] lg:items-start">
            <aside className="lg:sticky lg:top-32">
              <div className="rounded-2xl border border-forest-900/8 bg-cream-50 p-4">
                <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
                  এই পেজে
                </p>
                <nav className="mt-2 space-y-0.5">
                  {document.sections.map((section) => (
                    <a
                      key={section.id}
                      href={`#${section.id}`}
                      className="block rounded-lg px-2.5 py-1.5 text-[11px] text-forest-800 transition-colors hover:bg-cream-100 hover:text-forest-950"
                    >
                      {section.title}
                    </a>
                  ))}
                </nav>
              </div>

              <div className="mt-3 rounded-2xl border border-gold-500/20 bg-gold-500/8 p-4">
                <p className="flex items-center gap-1.5 text-[11px] font-semibold text-forest-900">
                  <ShieldCheck size={13} className="text-gold-600" />
                  সহায়তা প্রয়োজন?
                </p>
                <p className="mt-1 text-[9px] leading-relaxed text-muted">
                  নিয়ম নিয়ে প্রশ্ন থাকলে আমাদের টিম সঙ্গে যোগাযোগ করুন।
                </p>
                <div className="mt-2.5 space-y-1.5 text-[9px] text-forest-800">
                  <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-1.5 hover:text-clay-600">
                    <Mail size={11} /> {siteConfig.email}
                  </a>
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-1.5 hover:text-clay-600">
                    <Phone size={11} /> {siteConfig.phone}
                  </a>
                  <p className="flex items-start gap-1.5 text-muted">
                    <MapPin size={11} className="mt-0.5 shrink-0" /> {siteConfig.address}
                  </p>
                </div>
                <Link
                  href="/contact"
                  className="mt-3 inline-flex h-8 items-center rounded-full bg-forest-900 px-3 text-[9px] font-semibold text-cream-50 hover:bg-forest-700"
                >
                  যোগাযোগ করুন
                </Link>
              </div>
            </aside>

            <article className="overflow-hidden rounded-3xl border border-forest-900/8 bg-cream-50">
              <div className="border-b border-forest-900/8 bg-cream-100/40 px-5 py-5 sm:px-7">
                <p className="text-[11px] leading-relaxed text-forest-800/75">
                  {document.intro}
                </p>
              </div>
              <div className="space-y-7 px-5 py-6 sm:px-7 sm:py-8">
                {document.sections.map((section, index) => (
                  <section key={section.id} id={section.id} className="scroll-mt-32">
                    <div className="flex items-start gap-2.5">
                      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-lg bg-forest-100 font-display text-[11px] font-bold text-forest-700">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h2 className="pt-1 font-display text-lg font-bold leading-snug text-forest-950 sm:text-xl">
                        {section.title}
                      </h2>
                    </div>
                    {section.paragraphs && (
                      <div className="mt-2 space-y-2 pl-9 text-[12px] leading-relaxed text-forest-900/70 sm:text-[13px]">
                        {section.paragraphs.map((paragraph) => (
                          <p key={paragraph.slice(0, 40)}>{paragraph}</p>
                        ))}
                      </div>
                    )}
                    {section.bullets && (
                      <ul className="mt-2 space-y-1.5 pl-9 text-[12px] leading-relaxed text-forest-900/70 sm:text-[13px]">
                        {section.bullets.map((bullet) => (
                          <li key={bullet.slice(0, 40)} className="flex items-start gap-2">
                            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-gold-500" />
                            {bullet}
                          </li>
                        ))}
                      </ul>
                    )}
                  </section>
                ))}
              </div>
              <div className="border-t border-forest-900/8 bg-cream-100/40 px-5 py-4 text-[9px] leading-relaxed text-muted sm:px-7">
                এই নীতিমালাটি TalkNest BD-এর ডেমো ওয়েবসাইটের জন্য প্রস্তুত করা
                হয়েছে। ভবিষ্যতে আসল সেবা চালু হলে আইনগত পরামর্শের ভিত্তিতে এটি
                হালনাগাদ করা হবে।
              </div>
            </article>
          </div>
        </Container>
      </section>
    </>
  );
}
