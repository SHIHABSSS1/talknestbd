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
    if (!values.name.trim()) next.name = "Enter the recipient's name";
    if (values.phone.replace(/\D/g, "").length < 11) {
      next.phone = "Enter an 11-digit mobile number";
    }
    if (values.email && !/^\S+@\S+\.\S+$/.test(values.email)) {
      next.email = "Enter a valid email address";
    }
    if (!values.district.trim()) next.district = "Enter the district";
    if (!values.area.trim()) next.area = "Enter the thana or area";
    if (!values.street.trim()) next.street = "Enter the full street address";

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
    notify("Address saved");
    resetForm();
  };

  if (!loaded) {
    return <div className="h-64 animate-pulse rounded-3xl bg-cream-100" />;
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="font-display text-xl font-bold text-forest-950">Saved addresses</h1>
          <p className="mt-0.5 text-[10px] text-muted">
            Save addresses now for a faster checkout later.
          </p>
        </div>
        {!formOpen && (
          <Button type="button" size="sm" onClick={() => setFormOpen(true)}>
            <Plus size={14} />
            New address
          </Button>
        )}
      </div>

      {addresses.length === 0 && !formOpen && (
        <div className="rounded-3xl border border-dashed border-forest-900/15 bg-cream-100/40 px-6 py-12 text-center">
          <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-forest-100 text-forest-700">
            <MapPin size={20} />
          </span>
          <h2 className="mt-3 font-display text-lg font-bold text-forest-950">
            No addresses saved yet
          </h2>
          <p className="mx-auto mt-1 max-w-sm text-[11px] leading-relaxed text-muted">
            Add your first address so you do not need to enter the same details at every checkout.
          </p>
          <Button type="button" size="sm" className="mt-4" onClick={() => setFormOpen(true)}>
            <Plus size={13} />
            Add address
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
                    <Star size={9} className="fill-current" /> Default
                  </Badge>
                ) : (
                  <button
                    type="button"
                    onClick={() => {
                      makeDefaultAddress(address.id);
                      refresh();
                      notify("Default address updated");
                    }}
                    className="text-[9px] font-medium text-clay-600 hover:text-clay-500"
                  >
                    Make default
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
                    notify("Address removed");
                  }}
                  className="inline-flex items-center gap-1 text-[9px] font-medium text-clay-600 hover:text-clay-500"
                >
                  <Trash2 size={11} />
                  Remove
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
              Add a new address
            </h2>
            <button
              type="button"
              onClick={resetForm}
              aria-label="Close form"
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
              {addresses.length === 0 ? "This is my default address" : "Set as default address"}
            </label>
            <div className="flex gap-2">
              <Button type="button" variant="ghost" size="sm" onClick={resetForm}>
                Cancel
              </Button>
              <Button type="button" size="sm" onClick={save}>
                <Check size={13} />
                Save address
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
