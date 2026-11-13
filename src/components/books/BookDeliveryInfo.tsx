import Link from "next/link";
import {
  AlertTriangle,
  CalendarClock,
  CheckCircle2,
  CloudRain,
  Headphones,
  MapPin,
  PackageCheck,
  PackageSearch,
  PhoneCall,
  Truck,
  Zap,
} from "lucide-react";
import { siteConfig } from "@/lib/utils";

const timeline = [
  {
    icon: PhoneCall,
    label: "Order confirmed",
    note: "We call you within 24 hours",
  },
  {
    icon: PackageSearch,
    label: "Packed",
    note: "Ready within 24–48 hours",
  },
  {
    icon: Truck,
    label: "In transit",
    note: "2–6 days on the road",
  },
  {
    icon: PackageCheck,
    label: "Delivered",
    note: "3–7 days in total",
  },
];

const delayReasons = [
  {
    icon: CloudRain,
    title: "Heavy rain or flooding",
    text: "Waterlogged roads slow every rider down. We wait for safe roads rather than risk your parcel.",
  },
  {
    icon: CalendarClock,
    title: "Festival and courier rush",
    text: "Around Eid, Pohela Boishakh and Valentine's Day, parcel volume triples and sorting takes longer.",
  },
  {
    icon: PhoneCall,
    title: "Cash-on-delivery call pending",
    text: "The rider must reach you by phone to confirm the parcel. An unanswered call pauses the delivery.",
  },
  {
    icon: MapPin,
    title: "Address or phone problem",
    text: "A missing house number, a wrong district or an inactive number means the parcel comes back to us.",
  },
  {
    icon: PackageSearch,
    title: "Repacking or a publisher delay",
    text: "If a book needs a new cover or the publisher ships late, the parcel leaves our shelf a little later.",
  },
  {
    icon: AlertTriangle,
    title: "Remote district transfer",
    text: "Outside Dhaka and Chattogram, parcels first move to the district hub, which adds one extra day.",
  },
];

export function BookDeliveryInfo() {
  return (
    <div className="max-w-4xl">
      {/* Delivery window */}
      <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_minmax(0,1.4fr)]">
        <div className="rounded-2xl border border-forest-900/8 bg-forest-50 p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-forest-600">
            Typical delivery time
          </p>
          <p className="mt-1 font-display text-4xl font-bold text-forest-950">3–7</p>
          <p className="text-[12px] font-semibold text-forest-800">days after order</p>
          <ul className="mt-4 space-y-2 text-[11px] text-forest-900/70">
            <li className="flex items-start gap-2">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-forest-600" />
              Inside Dhaka: 2–4 working days
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-forest-600" />
              Outside Dhaka: 3–7 working days
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 size={13} className="mt-0.5 shrink-0 text-forest-600" />
              Free delivery on orders over ৳999
            </li>
          </ul>
        </div>

        {/* Step timeline */}
        <div className="rounded-2xl border border-forest-900/8 bg-cream-100/60 p-5">
          <p className="text-[9px] font-semibold uppercase tracking-[0.18em] text-clay-500">
            How your order travels
          </p>
          <ol className="mt-4 grid gap-4 sm:grid-cols-2">
            {timeline.map((step, index) => {
              const Icon = step.icon;
              return (
                <li key={step.label} className="flex items-start gap-3">
                  <span className="relative grid h-10 w-10 shrink-0 place-items-center rounded-full border border-forest-900/10 bg-cream-50 text-forest-700">
                    <Icon size={16} />
                    <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-forest-900 text-[8px] font-bold text-cream-50">
                      {index + 1}
                    </span>
                  </span>
                  <span className="min-w-0">
                    <span className="block text-[12px] font-semibold text-forest-950">
                      {step.label}
                    </span>
                    <span className="mt-0.5 block text-[10px] leading-snug text-muted">
                      {step.note}
                    </span>
                  </span>
                </li>
              );
            })}
          </ol>
        </div>
      </div>

      {/* Digital copy */}
      <div className="mt-4 overflow-hidden rounded-2xl border border-gold-500/30 bg-gradient-to-br from-cream-50 to-gold-500/10 p-5">
        <div className="flex items-start gap-3">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gold-500 text-forest-950">
            <Zap size={19} />
          </span>
          <div className="min-w-0">
            <p className="font-display text-lg font-bold text-forest-950">
              Digital copy within 5 hours
            </p>
            <p className="mt-1 text-[12px] leading-relaxed text-forest-900/75">
              Order the digital copy and it reaches your inbox within five
              hours — even when our support desk is busy with orders, festival
              rushes or a courier backlog. The digital file is prepared
              automatically, so it never waits for the printed parcel.
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-2.5 py-1 text-[10px] font-medium text-forest-800">
                <Zap size={11} className="text-gold-600" />
                Ready in 5 hours
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-2.5 py-1 text-[10px] font-medium text-forest-800">
                <Headphones size={11} className="text-forest-600" />
                PDF and MP3
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full border border-forest-900/10 bg-cream-50 px-2.5 py-1 text-[10px] font-medium text-forest-800">
                <CheckCircle2 size={11} className="text-forest-600" />
                Keep it forever
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Delay reasons */}
      <div className="mt-7">
        <div className="flex items-center gap-2">
          <span className="grid h-8 w-8 place-items-center rounded-lg bg-gold-500/15 text-gold-600">
            <AlertTriangle size={15} />
          </span>
          <div>
            <h3 className="font-display text-lg font-bold text-forest-950">
              Why a delivery can run late
            </h3>
            <p className="text-[9px] uppercase tracking-[0.16em] text-muted">
              Honest reasons, no excuses
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {delayReasons.map((reason) => {
            const Icon = reason.icon;
            return (
              <div
                key={reason.title}
                className="flex items-start gap-3 rounded-2xl border border-forest-900/8 bg-cream-100/50 p-4"
              >
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-cream-50 text-clay-500">
                  <Icon size={16} />
                </span>
                <div className="min-w-0">
                  <p className="text-[12px] font-semibold text-forest-950">
                    {reason.title}
                  </p>
                  <p className="mt-1 text-[11px] leading-relaxed text-forest-900/65">
                    {reason.text}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Support */}
      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-dashed border-forest-500/25 bg-forest-50 px-4 py-3.5">
        <p className="text-[11px] leading-relaxed text-forest-800/75">
          Need it faster? Call{" "}
          <a
            href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
            className="font-semibold text-forest-800 underline-offset-2 hover:underline"
          >
            {siteConfig.phone}
          </a>{" "}
          and we will tell you the exact day your parcel reaches you.
        </p>
        <Link
          href="/free-order"
          className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-forest-900 px-4 text-[11px] font-semibold text-cream-50 transition-colors hover:bg-forest-700"
        >
          <Truck size={14} />
          Delivery details
        </Link>
      </div>
    </div>
  );
}
