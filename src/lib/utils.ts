const bengaliDigits: Record<string, string> = {
  "\u09E6": "0",
  "\u09E7": "1",
  "\u09E8": "2",
  "\u09E9": "3",
  "\u09EA": "4",
  "\u09EB": "5",
  "\u09EC": "6",
  "\u09ED": "7",
  "\u09EE": "8",
  "\u09EF": "9",
};

/**
 * The English-first build shows Western digits everywhere. This helper is kept
 * under its original name because every catalogue surface already imports it.
 */
export function toBn(value: number | string): string {
  return String(value)
    .replace(/[\u09E6-\u09EF]/g, (digit) => bengaliDigits[digit] ?? digit)
    .replace(/\d/g, (digit) => digit);
}

export function formatCount(value: number | string): string {
  const number = Number(value);
  return Number.isFinite(number) ? number.toLocaleString("en-US") : String(value);
}

export function formatPrice(value: number): string {
  return `৳${formatCount(value)}`;
}

export function discountPercent(price: number, oldPrice?: number): number | null {
  if (!oldPrice || oldPrice <= price) return null;
  return Math.round(((oldPrice - price) / oldPrice) * 100);
}

export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(" ");
}

export function initials(name: string): string {
  return name
    .replace(/^(Dr\.|Professor|Maulana|Sheikh|Mr\.|Ms\.)\s+/i, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("")
    .toUpperCase();
}

export const siteConfig = {
  name: "TalkNest BD",
  tagline: "Bangladesh's favourite home for books",
  description:
    "TalkNest BD — a trusted home for Bangla books, Islamic history, audiobooks, used books, writers and independent publishers.",
  phone: "+880 1712-345678",
  email: "hello@talknestbd.com",
  address: "12/A Bailey Road, Dhaka 1000",
  whatsapp: "https://wa.me/8801712345678",
  facebook: "https://facebook.com/talknestbd",
  youtube: "https://www.youtube.com/@talknestbd",
  freeDeliveryThreshold: 999,
  buybackRate: 50,
};
