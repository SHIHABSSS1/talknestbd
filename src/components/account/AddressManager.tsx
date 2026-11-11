"use client";

import { useEffect, useState } from "react";
import {
  Check,
  MapPin,
  Plus,
  Star,
  Trash2,
  X,
} from "lucide-react";
import {
  makeDefaultAddress,
  readAddresses,
  removeAddress,
  saveAddress,
  type AddressFormValues,
  type SavedAddress,
} from "@/lib/orders";
import { useStore } from "@/lib/store";
import { cn } from "@/lib/utils";
import { AddressFields, emptyAddress } from "@/components/forms/AddressFields";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export function AddressManager() {
  const { notify } = useStore();
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [loaded, setLoaded] = useState(false);
  const [formOpen, setFormOpen] = useState(false);
  const [values, setValues] = useState<AddressFormValues>(emptyAddress);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [makeDefault, setMakeDefault] = useState(false);

  const refresh = () => setAddresses(readAddresses());

  useEffect(() => {
    refresh();
    setLoaded(true);
  }, []);

  const resetForm = () => {
    setValues(emptyAddress);
    setErrors({});
    setMakeDefault(false);
    setFormOpen(false);
  };

  const save = () => {
    const next: Record<string, string> = {};
    if (!values.name.trim()) next.name = "প্রাপকের নাম লিখুন";
    if (values.phone.replace(/\D/g, "").length < 11) {
      next.phone = "১১ ডিজিটের মোবাইল নম্বর দিন";
    }
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      next.email = "সঠিক ইমেইল দিন";
    }
    if (!values.district.trim()) next.district = "জেলার নাম লিখুন";
    if (!values.area.trim()) next.area = "থানা বা এলাকার নাম লিখুন";
    if (!values.street.trim()) next.street = "বিস্তারিত ঠিকানা লিখুন";

    if (Object.keys(next).length > 0) {
      setErrors(next);
      return;
    }

    saveAddress({
      ...values,
      email: values.email?.trim() || undefined,
      isDefault: makeDefault || addresses.length === 0,
    });
    refresh();
    notify("ঠিকানা সংরক্ষণ হয়েছে");
    resetForm();
  };

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-3xl bg-cream-100" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-xl font-bold text-forest-950">সংরক্ষিত ঠিকানা</h1>
          <p className="mt-0.5 text-[10px] text-muted">
            চেকআউটের সময় দ্রুত ঠিকানা বেছে নিতে সংরক্ষণ করুন।
          </p>
        </div>
        {!formOpen && (
          <Button type="button" size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} />
            নতুন ঠিকানা
          </Button>
        )}
      </div>

      {addresses.length === 0 && !formOpen && (
        <div className="rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/40 px-6 py-12 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
            <MapPin size={20} />
          </span>
          <h2 className="mt-3 font-display text-lg font-bold text-forest-950">
            এখনো কোনো ঠিকানা সংরক্ষণ করা হয়নি
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-muted">
            প্রথম ঠিকানাটি যোগ করুন — চেকআউটে আর প্রতিবার একই তথ্য লিখতে হবে না।
          </p>
          <Button type="button" size="sm" className="mt-4" onClick={() => setFormOpen(true)}>
            <Plus size={13} />
            ঠিকানা যোগ করুন
          </Button>
        </div>
      )}

      {addresses.length > 0 && (
        <div className="grid gap-3 sm:grid-cols-2">
          {addresses.map((address) => (
            <article
              key={address.id}
              className={cn(
                "relative rounded-2xl border bg-cream-50 p-4",
                address.isDefault
                  ? "border-forest-700/25 ring-1 ring-forest-700/10"
                  : "border-forest-900/10",
              )}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 text-[9px] font-semibold uppercase tracking-[0.14em] text-forest-700">
                  <MapPin size={12} />
                  {address.label}
                </span>
                {address.isDefault ? (
                  <Badge tone="gold">
                    <Star size={9} className="fill-current" /> ডিফল্ট
                  </Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      makeDefaultAddress(address.id);
                      refresh();
                      notify("ডিফল্ট ঠিকানা বদলানো হয়েছে");
                    }}
                    className="text-[9px] font-medium text-clay-600 hover:text-clay-500"
                  >
                    ডিফল্ট করুন
                  </button>
                )}
              </div>
              <h3 className="mt-2 text-xs font-semibold text-forest-950">{address.name}</h3>
              <p className="text-[10px] text-muted">{address.phone}</p>
              {address.email && <p className="text-[9px] text-muted">{address.email}</p>}
              <p className="mt-1.5 text-[10px] leading-relaxed text-muted">
                {address.street}, {address.area}, {address.district}, {address.division}
                {address.postcode ? ` - ${address.postcode}` : ""}
              </p>
              <div className="mt-3 flex items-center justify-end border-t border-forest-900/8 pt-2.5">
                <button
                  type="button"
                  onClick={() => {
                    removeAddress(address.id);
                    refresh();
                    notify("ঠিকানা সরানো হয়েছে");
                  }}
                  className="inline-flex items-center gap-1 text-[9px] font-medium text-clay-600 hover:text-clay-500"
                >
                  <Trash2 size={11} />
                  সরান
                </button>
              </div>
            </article>
          ))}
        </div>
      )}

      {formOpen && (
        <div className="rounded-3xl border border-forest-900/10 bg-cream-50 p-4 sm:p-5">
          <div className="mb-4 flex items-center justify-between gap-3">
            <h2 className="font-display text-base font-bold text-forest-950">
              নতুন ঠিকানা যোগ করুন
            </h2>
            <button
              type="button"
              onClick={resetForm}
              aria-label="ফর্ম বন্ধ করুন"
              className="grid h-8 w-8 place-items-center rounded-full border border-forest-900/10 text-forest-800 hover:bg-cream-100"
            >
              <X size={14} />
            </button>
          </div>

          <AddressFields
            values={values}
            onChange={(patch) => setValues((previous) => ({ ...previous, ...patch }))}
            errors={errors}
            idPrefix="account-address"
          />

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <label className="flex cursor-pointer items-center gap-2 text-[11px] text-forest-800">
              <input
                type="checkbox"
                checked={makeDefault || addresses.length === 0}
                disabled={addresses.length === 0}
                onChange={(event) => setMakeDefault(event.target.checked)}
                className="h-3.5 w-3.5 accent-forest-900"
              />
              {addresses.length === 0 ? "এটি আমার ডিফল্ট ঠিকানা" : "ডিফল্ট ঠিকানা হিসেবে সেট করুন"}
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                বাতিল
              </Button>
              <Button type="button" size="sm" onClick={save}>
                <Check size={13} />
                ঠিকানা সংরক্ষণ করুন
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
