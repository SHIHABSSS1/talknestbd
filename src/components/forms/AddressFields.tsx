"use client";

import type { AddressFormValues } from "@/lib/orders";
import { cn } from "@/lib/utils";

export const divisions = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Khulna",
  "Barishal",
  "Sylhet",
  "Rangpur",
  "Mymensingh",
];

export const emptyAddress: AddressFormValues = {
  label: "Home",
  name: "",
  phone: "",
  email: "",
  division: "Dhaka",
  district: "",
  area: "",
  street: "",
  postcode: "",
};

const inputClass =
  "h-11 w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25";

export function AddressFields({
  values,
  onChange,
  errors = {},
  idPrefix = "address",
}: {
  values: AddressFormValues;
  onChange: (patch: Partial<AddressFormValues>) => void;
  errors?: Record<string, string>;
  idPrefix?: string;
}) {
  const field = (name: keyof AddressFormValues) => `${idPrefix}-${name}`;

  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <label className="block" htmlFor={field("name")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Recipient's name <span className="text-clay-500">*</span>
        </span>
        <input
          id={field("name")}
          value={values.name}
          onChange={(event) => onChange({ name: event.target.value })}
          placeholder="e.g. Tanha Rahman"
          autoComplete="name"
          className={cn(inputClass, errors.name && "border-clay-500/70")}
        />
        {errors.name && (
          <span className="mt-1 block text-[10px] text-clay-600">{errors.name}</span>
        )}
      </label>

      <label className="block" htmlFor={field("phone")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Mobile number <span className="text-clay-500">*</span>
        </span>
        <input
          id={field("phone")}
          value={values.phone}
          onChange={(event) => onChange({ phone: event.target.value })}
          placeholder="+880 1XXXXXXXXX"
          autoComplete="tel"
          inputMode="tel"
          className={cn(inputClass, errors.phone && "border-clay-500/70")}
        />
        {errors.phone && (
          <span className="mt-1 block text-[10px] text-clay-600">{errors.phone}</span>
        )}
      </label>

      <label className="block sm:col-span-2" htmlFor={field("email")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Email <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          id={field("email")}
          value={values.email ?? ""}
          onChange={(event) => onChange({ email: event.target.value })}
          placeholder="you@example.com"
          autoComplete="email"
          inputMode="email"
          className={cn(inputClass, errors.email && "border-clay-500/70")}
        />
        {errors.email && (
          <span className="mt-1 block text-[10px] text-clay-600">{errors.email}</span>
        )}
      </label>

      <label className="block" htmlFor={field("label")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Address type
        </span>
        <select
          id={field("label")}
          value={values.label}
          onChange={(event) => onChange({ label: event.target.value })}
          className={inputClass}
        >
          <option value="Home">Home</option>
          <option value="Office">Office</option>
          <option value="Other">Other</option>
        </select>
      </label>

      <label className="block" htmlFor={field("division")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Division <span className="text-clay-500">*</span>
        </span>
        <select
          id={field("division")}
          value={values.division}
          onChange={(event) => onChange({ division: event.target.value })}
          className={cn(inputClass, errors.division && "border-clay-500/70")}
        >
          {divisions.map((division) => (
            <option key={division} value={division}>
              {division}
            </option>
          ))}
        </select>
      </label>

      <label className="block" htmlFor={field("district")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          District <span className="text-clay-500">*</span>
        </span>
        <input
          id={field("district")}
          value={values.district}
          onChange={(event) => onChange({ district: event.target.value })}
          placeholder="e.g. Dhaka"
          className={cn(inputClass, errors.district && "border-clay-500/70")}
        />
        {errors.district && (
          <span className="mt-1 block text-[10px] text-clay-600">{errors.district}</span>
        )}
      </label>

      <label className="block" htmlFor={field("area")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Upazila / area <span className="text-clay-500">*</span>
        </span>
        <input
          id={field("area")}
          value={values.area}
          onChange={(event) => onChange({ area: event.target.value })}
          placeholder="e.g. Dhanmondi"
          className={cn(inputClass, errors.area && "border-clay-500/70")}
        />
        {errors.area && (
          <span className="mt-1 block text-[10px] text-clay-600">{errors.area}</span>
        )}
      </label>

      <label className="block sm:col-span-2" htmlFor={field("street")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Full address <span className="text-clay-500">*</span>
        </span>
        <textarea
          id={field("street")}
          value={values.street}
          onChange={(event) => onChange({ street: event.target.value })}
          placeholder="House / road / block number"
          rows={2}
          className={cn(
            "w-full rounded-xl border border-forest-900/12 bg-cream-50 px-3.5 py-2.5 text-[13px] text-forest-950 placeholder:text-muted/50 focus:border-forest-700/40 focus:outline-none focus:ring-2 focus:ring-gold-500/25",
            errors.street && "border-clay-500/70",
          )}
        />
        {errors.street && (
          <span className="mt-1 block text-[10px] text-clay-600">{errors.street}</span>
        )}
      </label>

      <label className="block" htmlFor={field("postcode")}>
        <span className="mb-1 block text-[11px] font-semibold text-forest-900">
          Postcode <span className="font-normal text-muted">(optional)</span>
        </span>
        <input
          id={field("postcode")}
          value={values.postcode ?? ""}
          onChange={(event) => onChange({ postcode: event.target.value })}
          placeholder="e.g. 1209"
          inputMode="numeric"
          className={inputClass}
        />
      </label>
    </div>
  );
}
