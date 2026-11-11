import Link from "next/link";
import { ArrowRight, ArrowUpRight, Recycle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function UsedBooksBanner() {
  return (
    <section className="py-10 sm:py-14">
      <Container>
        <div className="grid overflow-hidden rounded-[2rem] border border-forest-900/10 bg-cream-200 lg:grid-cols-2">
          <div className="relative min-h-[240px] overflow-hidden lg:min-h-[340px]">
            {/* Demo image: online source */}
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80"
              alt="বইয়ের স্তূপ"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-forest-950/10 to-cream-200/20" />
            <div className="absolute left-5 top-5 rounded-2xl bg-forest-950 px-4 py-3 text-cream-50 shadow-lg sm:left-7 sm:top-7">
              <p className="font-display text-3xl font-bold text-gold-300 sm:text-4xl">৫০% আপ</p>
              <p className="text-[10px] text-cream-100/60">পুরাতন বইয়ে বিশেষ দাম</p>
            </div>
            <div className="absolute bottom-5 left-5 flex items-center gap-2 rounded-full bg-cream-50/90 px-3.5 py-2 text-[10px] font-medium text-forest-900 backdrop-blur sm:bottom-7 sm:left-7">
              <Recycle size={13} className="text-clay-500" />
              বইয়ের দ্বিতীয় জীবন
            </div>
          </div>

          <div className="relative p-6 sm:p-9 lg:p-12">
            <div
              aria-hidden="true"
              className="absolute -right-8 -top-10 h-32 w-32 rounded-full border border-forest-900/10"
            />
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-clay-600">
              <Sparkles size={13} />
              Used Book Marketplace
            </span>
            <h2 className="mt-3 max-w-md font-display text-2xl font-bold leading-snug text-forest-950 sm:text-3xl lg:text-[2.1rem]">
              পাঠক থেকে পাঠকের কাছে —
              <span className="text-clay-600"> পুরাতন বই, নতুন খুশি।</span>
            </h2>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-forest-800/65">
              আপনার পড়া শেষ হয়ে যাওয়া বই বিক্রি করুন, আবার অর্ধেক দামে কিনে
              নিন অন্য পাঠকের প্রিয় বই। টেকসই পড়ার অভ্যাসে যোগ দিন আপনার বইও।
            </p>

            <div className="mt-5 flex flex-wrap gap-3">
              <Button href="/used-books" variant="primary">
                পুরাতন বই দেখুন
                <ArrowRight size={16} />
              </Button>
              <Button href="/used-books#sell" variant="outline">
                নিজের বই বিক্রি করুন
              </Button>
            </div>

            <div className="mt-6 flex flex-wrap gap-x-6 gap-y-2 text-[11px] text-forest-800/65">
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-forest-500" />
                যাচাই করা কন্ডিশন
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-clay-500" />
                নিরাপদ পেমেন্ট
              </span>
              <span className="flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-gold-500" />
                দ্রুত ডেলিভারি
              </span>
            </div>

            <Link
              href="/used-books"
              className="mt-5 inline-flex items-center gap-1.5 text-[11px] font-semibold text-forest-800 transition-colors hover:text-clay-600"
            >
              কীভাবে কাজ করে?
              <ArrowUpRight size={13} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
