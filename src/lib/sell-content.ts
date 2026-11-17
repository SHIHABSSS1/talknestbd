/**
 * Editable content for the homepage "Sell used books" banner and the full
 * /sell-used-books page. Persisted in localStorage (demo only — no backend).
 */

export type SellIconKey =
  | "book"
  | "package"
  | "shield"
  | "banknote"
  | "repeat"
  | "check"
  | "clock"
  | "recycle";

export interface SellStep {
  id: string;
  icon: SellIconKey;
  title: string;
  text: string;
}

export interface SellStat {
  id: string;
  value: string;
  label: string;
}

export interface SellFaq {
  id: string;
  question: string;
  answer: string;
}

export interface SellTestimonial {
  id: string;
  name: string;
  text: string;
}

export interface SellPageContent {
  hero: { eyebrow: string; title: string; description: string; badges: string[] };
  steps: SellStep[];
  why: {
    eyebrow: string;
    title: string;
    description: string;
    stats: SellStat[];
    ctaPrimary: string;
    ctaPrimaryHref: string;
    ctaSecondary: string;
    ctaSecondaryHref: string;
  };
  policyLink: { label: string; href: string };
  accepted: string[];
  notAccepted: string[];
  assurances: string[];
  sellingNote: string;
  testimonials: SellTestimonial[];
  faqs: SellFaq[];
  bottomCta: {
    text: string;
    primaryLabel: string;
    primaryHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  noteHeading: string;
}

export interface SellCondition {
  id: string;
  label: string;
  rate: number;
  note: string;
}

export interface SellCalculatorContent {
  heading: string;
  subheading: string;
  conditions: SellCondition[];
  cap: number;
  disclaimer: string;
  eligibilityNote: string;
  submitLabel: string;
  successTitle: string;
  successText: string;
}

export interface SellContent {
  banner: {
    eyebrow: string;
    title: string;
    description: string;
    linkLabel: string;
    linkHref: string;
    secondaryLabel: string;
    secondaryHref: string;
  };
  page: SellPageContent;
  calculator: SellCalculatorContent;
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const SELL_STORAGE_KEY = "talknestbd-sell-used-books-v1";

export const sellIconKeys: { key: SellIconKey; label: string }[] = [
  { key: "book", label: "Book" },
  { key: "package", label: "Package" },
  { key: "shield", label: "Shield" },
  { key: "banknote", label: "Money" },
  { key: "repeat", label: "Recycle" },
  { key: "check", label: "Check" },
  { key: "clock", label: "Clock" },
  { key: "recycle", label: "Reuse" },
];

export const sellDefaults: SellContent = {
  banner: {
    eyebrow: "Sell Used Books",
    title: "Finished a book? Sell it to us and get 50% back.",
    description:
      "Buy any book from TalkNest, read it at your own pace, then sell it to us in readable condition. We will pay half the purchase price — simple, transparent and hassle-free.",
    linkLabel: "Sell your books",
    linkHref: "/sell-used-books",
    secondaryLabel: "Estimate your payout",
    secondaryHref: "/sell-used-books#calculator",
  },
  page: {
    hero: {
      eyebrow: "Sell Used Books",
      title: "Finished reading? Sell it to us and get 50% cash",
      description:
        "The books gathering dust on your shelf are waiting for a new reader. Sell a book you bought from TalkNest and get up to 50% of the purchase price back — simple, transparent and hassle-free.",
      badges: ["Up to 50% cash back", "Initial response within 24 hours", "A second life for books"],
    },
    steps: [
      {
        id: "step-1",
        icon: "book",
        title: "Finish the book",
        text: "Read and take good care of any book you bought from TalkNest BD.",
      },
      {
        id: "step-2",
        icon: "package",
        title: "Send photos and your order number",
        text: "Share photos of the front and back, the binding and your order number on WhatsApp.",
      },
      {
        id: "step-3",
        icon: "shield",
        title: "Inspection and offer",
        text: "Our team checks the book's condition and confirms the final selling value.",
      },
      {
        id: "step-4",
        icon: "banknote",
        title: "Get 50% cash back",
        text: "Once the book reaches us, we send your money via bKash or Nagad within 3–5 business days.",
      },
    ],
    why: {
      eyebrow: "Why sell used books",
      title: "One book, two readers, three times the joy",
      description:
        "Finishing a book doesn't end its journey. A book you sell to us is checked, cleaned and passed on to a new reader at a friendly price. You get cash, a new reader gets a beloved book — and together we waste less paper.",
      stats: [
        { id: "stat-1", value: "50%", label: "Max cash back" },
        { id: "stat-2", value: "3–5", label: "Days to payment" },
        { id: "stat-3", value: "2nd", label: "Life for the book" },
      ],
      ctaPrimary: "Apply on WhatsApp",
      ctaPrimaryHref: "https://wa.me/8801712345678",
      ctaSecondary: "Try the calculator",
      ctaSecondaryHref: "#calculator",
    },
    policyLink: { label: "return policy", href: "/return-policy#sell-used-books" },
    accepted: [
      "Books bought from TalkNest BD",
      "Pages, binding and cover intact",
      "Light marks from normal reading are fine",
      "Order number or proof of purchase",
    ],
    notAccepted: [
      "Books damaged by water, oil or ink",
      "Torn pages or broken binding",
      "Books written in by a previous owner",
      "Old editions or textbooks (case by case)",
    ],
    assurances: [
      "Reply within 24 hours of applying",
      "Transparent valuation",
      "Books get reused",
    ],
    sellingNote:
      "The 50% is calculated on our selling price. The final amount may be slightly lower depending on the book's condition, edition and demand. Full details are in our return policy.",
    testimonials: [
      {
        id: "test-1",
        name: "Sumaiya Akter",
        text: "I sold three old books and got 50% back. The whole process took just three days!",
      },
      {
        id: "test-2",
        name: "Abdullah Al Mamun",
        text: "They told me what I'd get right after I sent the photos. No hassle at all.",
      },
    ],
    faqs: [
      {
        id: "faq-1",
        question: "How long does the payment take?",
        answer:
          "After the book reaches us and passes inspection, we send the money via bKash, Nagad or bank transfer within 3–5 business days.",
      },
      {
        id: "faq-2",
        question: "Who pays for shipping the book?",
        answer:
          "Inside Dhaka our team can collect it. Outside Dhaka the reader usually covers the courier cost, but we can arrange something special for larger orders.",
      },
      {
        id: "faq-3",
        question: "How many books can I sell at once?",
        answer:
          "You can send several books together. Separate photos and condition notes for each book speed things up. The total selling value is capped at ৳20,000.",
      },
      {
        id: "faq-4",
        question: "Can I take another book of equal value instead of cash?",
        answer:
          "Yes. You can keep the amount as store credit and put it toward new books. Just let us know when you get in touch.",
      },
      {
        id: "faq-5",
        question: "Does the demo site really pay money?",
        answer:
          "No. This website is a front-end demo; no real payment or used-book transaction takes place here. These terms will apply when the real service launches.",
      },
    ],
    bottomCta: {
      text: "Get in touch today to find out what your books are worth.",
      primaryLabel: "Contact form",
      primaryHref: "/contact",
      secondaryLabel: "Buy used books",
      secondaryHref: "/used-books",
    },
    noteHeading: "How selling works",
  },
  calculator: {
    heading: "Sell Used Book Calculator",
    subheading: "See an estimated selling value based on the book's condition",
    conditions: [
      {
        id: "cond-1",
        label: "Like new",
        rate: 50,
        note: "Pages, binding and cover intact",
      },
      {
        id: "cond-2",
        label: "Good",
        rate: 45,
        note: "Normal signs of use",
      },
      {
        id: "cond-3",
        label: "Fair",
        rate: 35,
        note: "May have marks or creases",
      },
    ],
    cap: 20000,
    disclaimer:
      "This is only an estimate. The final value is confirmed after we receive and inspect the book. Textbooks and older editions may not be eligible to sell.",
    eligibilityNote: "Works for books with a purchase price up to ৳20,000.",
    submitLabel: "Request a sale",
    successTitle: "Your request is ready as a demo",
    successText:
      "For a real sale, contact us on WhatsApp with your order number and photos of the book.",
  },
};

export function cloneSellDefaults(): SellContent {
  return JSON.parse(JSON.stringify(sellDefaults)) as SellContent;
}

const VALID_ICONS = new Set<string>(sellIconKeys.map((item) => item.key));

function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function isStep(value: unknown): value is SellStep {
  if (!value || typeof value !== "object") return false;
  const step = value as Record<string, unknown>;
  return (
    typeof step.id === "string" &&
    typeof step.icon === "string" &&
    VALID_ICONS.has(step.icon) &&
    typeof step.title === "string" &&
    typeof step.text === "string"
  );
}

function isStat(value: unknown): value is SellStat {
  if (!value || typeof value !== "object") return false;
  const stat = value as Record<string, unknown>;
  return (
    typeof stat.id === "string" &&
    typeof stat.value === "string" &&
    typeof stat.label === "string"
  );
}

function isFaq(value: unknown): value is SellFaq {
  if (!value || typeof value !== "object") return false;
  const faq = value as Record<string, unknown>;
  return (
    typeof faq.id === "string" &&
    typeof faq.question === "string" &&
    typeof faq.answer === "string"
  );
}

function isTestimonial(value: unknown): value is SellTestimonial {
  if (!value || typeof value !== "object") return false;
  const item = value as Record<string, unknown>;
  return typeof item.id === "string" && typeof item.name === "string" && typeof item.text === "string";
}

function validPage(value: unknown): value is SellPageContent {
  if (!value || typeof value !== "object") return false;
  const page = value as Record<string, unknown>;
  const hero = page.hero as Record<string, unknown> | undefined;
  const why = page.why as Record<string, unknown> | undefined;
  const bottom = page.bottomCta as Record<string, unknown> | undefined;
  return (
    !!hero &&
    typeof hero.eyebrow === "string" &&
    typeof hero.title === "string" &&
    typeof hero.description === "string" &&
    strings(hero.badges) &&
    Array.isArray(page.steps) &&
    page.steps.every(isStep) &&
    !!why &&
    typeof why.eyebrow === "string" &&
    typeof why.title === "string" &&
    typeof why.description === "string" &&
    typeof why.ctaPrimary === "string" &&
    typeof why.ctaSecondary === "string" &&
    Array.isArray(why.stats) &&
    why.stats.every(isStat) &&
    strings(page.accepted) &&
    strings(page.notAccepted) &&
    strings(page.assurances) &&
    typeof page.sellingNote === "string" &&
    Array.isArray(page.testimonials) &&
    page.testimonials.every(isTestimonial) &&
    Array.isArray(page.faqs) &&
    page.faqs.every(isFaq) &&
    !!bottom &&
    typeof bottom.text === "string" &&
    typeof bottom.primaryLabel === "string" &&
    typeof bottom.secondaryLabel === "string"
  );
}

export function isCalculator(value: unknown): value is SellCalculatorContent {
  if (!value || typeof value !== "object") return false;
  const calc = value as Record<string, unknown>;
  return (
    typeof calc.heading === "string" &&
    typeof calc.subheading === "string" &&
    Array.isArray(calc.conditions) &&
    calc.conditions.every((item) => {
      if (!item || typeof item !== "object") return false;
      const condition = item as Record<string, unknown>;
      return (
        typeof condition.id === "string" &&
        typeof condition.label === "string" &&
        typeof condition.rate === "number" &&
        typeof condition.note === "string"
      );
    }) &&
    typeof calc.cap === "number" &&
    typeof calc.disclaimer === "string" &&
    typeof calc.eligibilityNote === "string" &&
    typeof calc.submitLabel === "string" &&
    typeof calc.successTitle === "string" &&
    typeof calc.successText === "string"
  );
}

export function readSellContent(): SellContent {
  const defaults = cloneSellDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(SELL_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<SellContent>;
    if (!parsed.banner || !validPage(parsed.page)) return defaults;
    return {
      banner: { ...defaults.banner, ...parsed.banner },
      page: {
        ...defaults.page,
        ...parsed.page,
        hero: { ...defaults.page.hero, ...parsed.page.hero },
        why: { ...defaults.page.why, ...parsed.page.why },
        policyLink: { ...defaults.page.policyLink, ...parsed.page.policyLink },
        bottomCta: { ...defaults.page.bottomCta, ...parsed.page.bottomCta },
      },
      calculator: isCalculator(parsed.calculator)
        ? parsed.calculator
        : defaults.calculator,
    };
  } catch {
    return defaults;
  }
}

export function writeSellContent(content: SellContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(SELL_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — the banner and page updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearSellContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(SELL_STORAGE_KEY);
    return { ok: true, message: "Restored the original sell-used-books content." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
