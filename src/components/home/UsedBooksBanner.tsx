import Link from "next/link";
import { ArrowRight, ArrowUpRight, Recycle, Sparkles } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { Button } from "@/components/ui/Button";

export function UsedBooksBanner() {
  return (
    <section className="bg-white py-8 sm:py-10">
      <Container>
        <div className="grid overflow-hidden rounded-[8px] border border-line bg-white lg:grid-cols-2">
          <div className="relative min-h-[240px] overflow-hidden lg:min-h-[340px]">
            {/* Demo image: online source */}
            <img
              src="https://images.unsplash.com/photo-1544947950-fa07a98d237f?auto=format&fit=crop&w=1000&q=80"
              alt="A stack of pre-loved books"
              className="absolute inset-0 h-full w-full object-cover"
              loading="lazy"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-brand-950/35 to-transparent" />
            <div className="absolute left-4 top-4 rounded-[4px] bg-brand-900 px-3.5 py-2.5 text-white sm:left-6 sm:top-6">
              <p className="text-2xl font-bold leading-none text-sale sm:text-3xl">50% off</p>
              <p className="mt-1 text-[9px] uppercase tracking-[0.1em] text-white/70">
                Pre-loved prices
              </p>
            </div>
            <div className="absolute bottom-4 left-4 flex items-center gap-2 rounded-full bg-white/90 px-3 py-1.5 text-[10px] font-medium text-brand-900 backdrop-blur sm:bottom-6 sm:left-6">
              <Recycle size={12} className="text-brand-600" />
              A second life for every book
            </div>
          </div>

          <div className="relative p-5 sm:p-8 lg:p-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.14em] text-brand-600">
              <Sparkles size={12} />
              Pre-loved books
            </span>
            <h2 className="mt-2.5 max-w-md text-2xl font-bold leading-snug text-ink sm:text-[30px]">
              A book&apos;s second life, at{" "}
              <span className="text-brand-600">half the price.</span>
            </h2>
            <p className="mt-2.5 max-w-md text-[13px] leading-relaxed text-body sm:text-sm">
              Sell the books you have finished and buy another reader&apos;s
              favourites for less. Every exchange keeps a good story in
              circulation.
            </p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button href="/used-books" variant="primary">
                Browse used books
                <ArrowRight size={15} />
              </Button>
              <Button href="/used-books#sell" variant="outline">
                Sell your books
              </Button>
            </div>

            <div className="mt-5 flex flex-wrap gap-x-5 gap-y-2 text-[11px] text-body">
              {["Checked condition", "Secure payment", "Fast delivery"].map(
                (item) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                    {item}
                  </span>
                ),
              )}
            </div>

            <Link
              href="/used-books"
              className="mt-4 inline-flex items-center gap-1.5 text-[11px] font-medium text-brand-700 transition-colors hover:text-brand-800"
            >
              How it works
              <ArrowUpRight size={12} />
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
