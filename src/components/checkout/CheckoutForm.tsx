"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  Banknote,
  Check,
  Lock,
  MapPin,
  ShieldCheck,
  ShoppingBag,
  Smartphone,
  Store,
  Truck,
  Zap,
} from "lucide-react";
import { useStore, useHydrated } from "@/lib/store";
import { unlockAudio } from "@/lib/audio";
import {
  readAddresses,
  saveAddress,
  saveOrder,
  generateOrderId,
  type AddressFormValues,
  type DeliveryMethod,
  type PaymentMethod,
  type SavedAddress,
} from "@/lib/orders";
import { cn, formatPrice, siteConfig, toBn } from "@/lib/utils";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { AddressFields, emptyAddress } from "@/components/forms/AddressFields";
import { SavedAddressPicker } from "./SavedAddressPicker";
import { CheckoutSummary } from "./CheckoutSummary";

const deliveryOptions: {
  value: DeliveryMethod;
  title: string;
  eta: string;
  icon: typeof Truck;
  base: number;
}[] = [
  { value: "standard", title: "Standard delivery", eta: "2–4 business days", icon: Truck, base: 60 },
  { value: "express", title: "Express delivery", eta: "1–2 business days", icon: Zap, base: 120 },
  { value: "pickup", title: "Store pickup", eta: "Ready today", icon: Store, base: 0 },
];

const paymentOptions: {
  value: PaymentMethod;
  title: string;
  subtitle: string;
  icon: typeof Banknote;
}[] = [
  { value: "cod", title: "Cash on delivery", subtitle: "Pay when your books arrive", icon: Banknote },
  { value: "bkash", title: "bKash", subtitle: "Mobile banking", icon: Smartphone },
  { value: "nagad", title: "Nagad", subtitle: "Mobile banking", icon: Smartphone },
];

function addressToValues(address: SavedAddress): AddressFormValues {
  return {
    label: address.label,
    name: address.name,
    phone: address.phone,
    email: address.email ?? "",
    division: address.division,
    district: address.district,
    area: address.area,
    street: address.street,
    postcode: address.postcode ?? "",
  };
}

export function CheckoutForm() {
  const router = useRouter();
  const { items, cartTotal, clearCart, notify } = useStore();
  const hydrated = useHydrated();
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [mode, setMode] = useState<"saved" | "new">("new");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [values, setValues] = useState<AddressFormValues>(emptyAddress);
  const [saveNewAddress, setSaveNewAddress] = useState(true);
  const [deliveryMethod, setDeliveryMethod] = useState<DeliveryMethod>("standard");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cod");
  const [paymentNumber, setPaymentNumber] = useState("");
  const [note, setNote] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const addresses = readAddresses();
    setSavedAddresses(addresses);
    if (addresses.length > 0) {
      const preferred = addresses.find((address) => address.isDefault) ?? addresses[0];
      setSelectedId(preferred.id);
      setMode("saved");
    }
  }, []);

  const selectedAddress = savedAddresses.find((address) => address.id === selectedId);
  const activeAddress: AddressFormValues =
    mode === "saved" && selectedAddress ? addressToValues(selectedAddress) : values;

  const deliveryCharge = useMemo(() => {
    if (deliveryMethod === "pickup") return 0;
    if (deliveryMethod === "express") return 120;
    return cartTotal >= siteConfig.freeDeliveryThreshold ? 0 : 60;
  }, [deliveryMethod, cartTotal]);

  const total = cartTotal + deliveryCharge;

  if (!hydrated) {
    return (
      <div className="grid gap-6 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {[0, 1, 2].map((block) => (
            <div key={block} className="h-40 animate-pulse rounded-3xl bg-cream-100" />
          ))}
        </div>
        <div className="h-80 animate-pulse rounded-3xl bg-cream-100" />
      </div>
    );
  }

  if (items.length === 0 && !submitting) {
    return (
      <EmptyState
        icon={<ShoppingBag size={24} />}
        title="There are no books in your cart to check out"
        description="Add your favourite books or Sunnah items to the cart first, then come back to check out."
        action={
          <div className="flex flex-wrap justify-center gap-3">
            <Button href="/books">Browse books</Button>
            <Button href="/cart" variant="outline">
              Back to cart
            </Button>
          </div>
        }
      />
    );
  }

  const validate = () => {
    const next: Record<string, string> = {};
    if (!activeAddress.name.trim()) next.name = "Enter the recipient's name";
    if (activeAddress.phone.replace(/\D/g, "").length < 11) {
      next.phone = "Enter a valid 11-digit mobile number";
    }
    if (activeAddress.email && !/^\S+@\S+\.\S+$/.test(activeAddress.email)) {
      next.email = "Enter a valid email address";
    }
    if (mode === "new") {
      if (!values.district.trim()) next.district = "Enter your district";
      if (!values.area.trim()) next.area = "Enter your upazila or area";
      if (!values.street.trim()) next.street = "Enter your full street address";
    }
    if (mode === "saved" && !selectedAddress) {
      next.address = "Choose a saved address";
    }
    if (paymentMethod !== "cod" && paymentNumber.replace(/\D/g, "").length < 11) {
      next.paymentNumber = "Enter the number you'll pay from";
    }
    return next;
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (items.length === 0 || submitting) return;
    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      document.getElementById("checkout-form")?.scrollIntoView({ behavior: "smooth", block: "start" });
      return;
    }
    setErrors({});
    setSubmitting(true);

    const order = {
      id: generateOrderId(),
      createdAt: new Date().toISOString(),
      items: items.map(({ slug, kind, title, price, meta, quantity }) => ({
        slug,
        kind,
        title,
        price,
        meta,
        quantity,
      })),
      subtotal: cartTotal,
      deliveryCharge,
      total,
      paymentMethod,
      deliveryMethod,
      address: {
        ...activeAddress,
        email: activeAddress.email?.trim() || undefined,
      },
      note: note.trim() || undefined,
      paymentNumber: paymentMethod === "cod" ? undefined : paymentNumber.trim(),
      status: "Confirmed" as const,
    };

    saveOrder(order);
    items
      .filter((item) => item.kind === "audio")
      .forEach((item) => unlockAudio(item.slug));
    if (mode === "new" && saveNewAddress) {
      saveAddress({
        ...values,
        email: values.email?.trim() || undefined,
        isDefault: savedAddresses.length === 0,
      });
    }
    notify("Order placed successfully");
    clearCart();
    router.push(`/orders/${order.id}`);
  };

  return (
    <form id="checkout-form" onSubmit={handleSubmit} noValidate>
      <div className="mb-5 flex items-start gap-2.5 rounded-2xl border border-gold-500/25 bg-gold-500/8 px-4 py-3">
        <ShieldCheck size={17} className="mt-0.5 shrink-0 text-gold-600" />
        <p className="text-[11px] leading-relaxed text-forest-800">
          <strong>Demo checkout:</strong> This is a front-end demo. No real
          payment will be taken, and your order will be stored only in this browser.
        </p>
      </div>

      <div className="grid gap-5 lg:grid-cols-[1fr_380px] lg:items-start">
        <div className="space-y-4">
          <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
            <StepTitle number="01" title="Contact & address" icon={MapPin} />
            {savedAddresses.length > 0 && (
              <div className="mt-4">
                <p className="mb-2 text-[11px] font-semibold text-forest-900">
                  Saved addresses
                </p>
                <SavedAddressPicker
                  addresses={savedAddresses}
                  selectedId={selectedId}
                  newSelected={mode === "new"}
                  onSelect={(address) => {
                    setMode("saved");
                    setSelectedId(address.id);
                    setErrors({});
                  }}
                  onSelectNew={() => {
                    setMode("new");
                    setSelectedId(null);
                    setErrors({});
                  }}
                />
              </div>
            )}

            {mode === "new" && (
              <div className={cn(savedAddresses.length > 0 && "mt-5 border-t border-forest-900/8 pt-4")}>
                {savedAddresses.length === 0 && (
                  <p className="mb-3 text-[10px] text-muted">
                    Fill in the details below for delivery.
                  </p>
                )}
                <AddressFields
                  values={values}
                  onChange={(patch) => setValues((previous) => ({ ...previous, ...patch }))}
                  errors={errors}
                  idPrefix="checkout"
                />
                <label className="mt-3 flex cursor-pointer items-center gap-2 text-[11px] text-forest-800">
                  <input
                    type="checkbox"
                    checked={saveNewAddress}
                    onChange={(event) => setSaveNewAddress(event.target.checked)}
                    className="h-3.5 w-3.5 accent-forest-900"
                  />
                  Save this address for next time
                </label>
              </div>
            )}

            {errors.address && (
              <p className="mt-2 text-[10px] text-clay-600">{errors.address}</p>
            )}
          </section>

          <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
            <StepTitle number="02" title="Delivery method" icon={Truck} />
            <div className="mt-4 grid gap-2">
              {deliveryOptions.map((option) => {
                const active = deliveryMethod === option.value;
                const charge =
                  option.value === "standard"
                    ? cartTotal >= siteConfig.freeDeliveryThreshold
                      ? 0
                      : 60
                    : option.base;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setDeliveryMethod(option.value)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl border p-3.5 text-left transition-all",
                      active
                        ? "border-forest-700 bg-forest-50/80 ring-1 ring-forest-700/20"
                        : "border-forest-900/10 bg-cream-50 hover:border-forest-900/25",
                    )}
                  >
                    <span
                      className={cn(
                        "grid h-9 w-9 shrink-0 place-items-center rounded-xl",
                        active ? "bg-forest-800 text-cream-50" : "bg-cream-100 text-forest-700",
                      )}
                    >
                      <Icon size={16} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-xs font-semibold text-forest-950">
                        {option.title}
                      </span>
                      <span className="block text-[10px] text-muted">{option.eta}</span>
                    </span>
                    <span className="shrink-0 text-right text-[11px] font-semibold text-forest-900">
                      {charge === 0 ? (
                        <span className="text-forest-600">Free</span>
                      ) : (
                        formatPrice(charge)
                      )}
                    </span>
                    <span
                      className={cn(
                        "grid h-5 w-5 shrink-0 place-items-center rounded-full border",
                        active
                          ? "border-forest-800 bg-forest-800 text-cream-50"
                          : "border-forest-900/20",
                      )}
                    >
                      {active && <Check size={11} />}
                    </span>
                  </button>
                );
              })}
            </div>
            {deliveryMethod === "pickup" && (
              <p className="mt-2 rounded-xl bg-cream-100 px-3 py-2 text-[10px] leading-relaxed text-muted">
                Pickup address: {siteConfig.address} · Sat–Thu, 10:00 AM – 8:00 PM
              </p>
            )}
          </section>

          <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
            <StepTitle number="03" title="Payment method" icon={Banknote} />
            <div className="mt-4 grid gap-2 sm:grid-cols-3">
              {paymentOptions.map((option) => {
                const active = paymentMethod === option.value;
                const Icon = option.icon;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setPaymentMethod(option.value);
                      setPaymentNumber("");
                      setErrors({});
                    }}
                    className={cn(
                      "rounded-2xl border p-3.5 text-left transition-all",
                      active
                        ? "border-forest-700 bg-forest-50/80 ring-1 ring-forest-700/20"
                        : "border-forest-900/10 bg-cream-50 hover:border-forest-900/25",
                    )}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <Icon size={17} className={active ? "text-forest-700" : "text-muted"} />
                      <span
                        className={cn(
                          "grid h-4.5 w-4.5 place-items-center rounded-full border",
                          active
                            ? "border-forest-800 bg-forest-800 text-cream-50"
                            : "border-forest-900/20",
                        )}
                      >
                        {active && <Check size={9} />}
                      </span>
                    </span>
                    <span className="mt-2 block text-xs font-semibold text-forest-950">
                      {option.title}
                    </span>
                    <span className="block text-[9px] text-muted">{option.subtitle}</span>
                  </button>
                );
              })}
            </div>

            {paymentMethod !== "cod" && (
              <label className="mt-4 block" htmlFor="payment-number">
                <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                  Number you'll pay from <span className="text-clay-500">*</span>
                </span>
                <input
                  id="payment-number"
                  value={paymentNumber}
                  onChange={(event) => setPaymentNumber(event.target.value)}
                  placeholder="01XXXXXXXXX"
                  inputMode="tel"
                  className={cn(
                    "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25",
                    errors.paymentNumber && "border-clay-500/70",
                  )}
                />
                {errors.paymentNumber && (
                  <span className="mt-1 block text-[10px] text-clay-600">
                    {errors.paymentNumber}
                  </span>
                )}
                <span className="mt-1 block text-[9px] leading-relaxed text-muted">
                  No money will be charged on this demo site. Payment
                  instructions will be sent after your order is confirmed.
                </span>
              </label>
            )}
          </section>

          <section className="rounded-3xl border border-forest-900/8 bg-cream-50 p-4 sm:p-5">
            <StepTitle number="04" title="Order notes" icon={ShoppingBag} />
            <label className="mt-4 block" htmlFor="order-note">
              <span className="mb-1 block text-[11px] font-semibold text-forest-900">
                Anything we should know about your order?{" "}
                <span className="font-normal text-muted">(optional)</span>
              </span>
              <textarea
                id="order-note"
                value={note}
                onChange={(event) => setNote(event.target.value)}
                rows={3}
                placeholder="For example: call after 5 PM, gift-wrap the book..."
                className="w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-2.5 text-[13px] placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25"
              />
            </label>
          </section>
        </div>

        <aside className="lg:sticky lg:top-[88px]">
          <CheckoutSummary
            items={items}
            subtotal={cartTotal}
            deliveryCharge={deliveryCharge}
            total={total}
            deliveryMethod={deliveryMethod}
            paymentMethod={paymentMethod}
          />
          <div className="mt-3 rounded-3xl border border-forest-900/8 bg-cream-50 p-4">
            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? (
                "Placing your order..."
              ) : (
                <>
                  <Lock size={15} />
                  Confirm order · {formatPrice(total)}
                </>
              )}
            </Button>
            <p className="mt-2.5 text-center text-[9px] leading-relaxed text-muted">
              By confirming, you agree to our{" "}
              <Link href="/terms" className="font-semibold text-clay-600 hover:text-clay-500">
                Terms & Conditions
              </Link>
              . This order will be saved in your browser as a demo.
            </p>
          </div>
          <div className="mt-3 flex items-center justify-between rounded-2xl border border-forest-900/8 bg-forest-50/50 px-4 py-3 text-[10px] text-forest-800/75">
            <span className="flex items-center gap-1.5">
              <ShieldCheck size={13} className="text-forest-600" />
              Secure & protected
            </span>
            <Badge tone="outline">100% original</Badge>
            <span className="tabular-nums">{toBn(items.length)} items</span>
          </div>
        </aside>
      </div>
    </form>
  );
}

function StepTitle({
  number,
  title,
  icon: Icon,
}: {
  number: string;
  title: string;
  icon: typeof MapPin;
}) {
  return (
    <div className="flex items-center gap-3">
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-forest-900 font-display text-sm font-bold text-gold-300">
        {number}
      </span>
      <h2 className="flex items-center gap-2 font-display text-base font-bold text-forest-950 sm:text-lg">
        <Icon size={16} className="text-forest-600" />
        {title}
      </h2>
    </div>
  );
}
