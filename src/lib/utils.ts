const bnDigits = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

export function toBn(value: number | string): string {
  return String(value).replace(/\d/g, (digit) => bnDigits[Number(digit)]);
}

export function formatPrice(value: number): string {
  return `৳${toBn(value)}`;
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
    .replace(/^(ড\.|প্রফেসর|মাওলানা|শাইখ|অধ্যাপক)\s+/, "")
    .split(" ")
    .slice(0, 2)
    .map((part) => part.charAt(0))
    .join("");
}

export const siteConfig = {
  name: "TalkNest BD",
  bengaliName: "টক নেস্ট বিডি",
  tagline: "বাংলাদেশের প্রিয় বইয়ের নীড়",
  description:
    "TalkNest BD — বাংলা বই, ইসলামিক বই, অডিও বুক, পুরাতন বই, লেখক ও প্রকাশকের একটি বিশ্বস্ত নীড়।",
  phone: "+880 1712-345678",
  email: "hello@talknestbd.com",
  address: "১২/এ, বেইলি রোড, ঢাকা ১০০০",
  whatsapp: "https://wa.me/8801712345678",
  facebook: "https://facebook.com/talknestbd",
  youtube: "https://www.youtube.com/@talknestbd",
  freeDeliveryThreshold: 999,
  buybackRate: 50,
};
