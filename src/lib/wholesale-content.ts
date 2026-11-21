/**
 * Editable content for the homepage free-order/wholesale section, the
 * /wholesale page and the /free-order page.
 *
 * The live document lives in Postgres (`content_blocks` key "wholesale").
 * The localStorage helpers below remain only so an admin can import copy saved
 * in this browser before the database existed.
 */

export type WholesaleIconKey =
  | "percent"
  | "truck"
  | "package"
  | "support"
  | "library"
  | "school"
  | "store"
  | "users";

export interface WholesaleTier {
  id: string;
  name: string;
  quantity: string;
  commission: string;
  delivery: string;
  highlight: boolean;
}

export interface WholesaleBenefit {
  id: string;
  icon: WholesaleIconKey;
  title: string;
  text: string;
}

export interface WholesaleFaq {
  id: string;
  question: string;
  answer: string;
}

export interface WholesaleContent {
  home: {
    eyebrow: string;
    title: string;
    description: string;
    wholesale: {
      badge: string;
      heading: string;
      text: string;
      cta: string;
      benefits: string[];
    };
    freeOrder: {
      badge: string;
      label: string;
      heading: string;
      text: string;
      cta: string;
    };
  };
  page: {
    hero: {
      eyebrow: string;
      title: string;
      description: string;
      badges: string[];
    };
    priceList: {
      heading: string;
      note: string;
      footer: string;
      termsLabel: string;
    };
    tiers: WholesaleTier[];
    benefits: WholesaleBenefit[];
    popularHeading: string;
    catalogueLabel: string;
    whoHeading: string;
    who: string[];
    faqHeading: string;
    faqs: WholesaleFaq[];
    whatsapp: { heading: string; text: string; linkLabel: string };
    bottomCta: { text: string; label: string };
  };
  /** Copy for the separate /free-order page. */
  freeOrderPage: FreeOrderPageContent;
}

/** Editable design/copy for the storefront /free-order page. */
export interface FreeOrderPageContent {
  hero: { eyebrow: string; title: string; description: string; badges: string[] };
  intro: { heading: string; text: string; note: string };
  steps: { id: string; title: string; text: string }[];
  charges: {
    heading: string;
    description: string;
    zones: { id: string; label: string; charge: string }[];
  };
  goodToKnow: { heading: string; items: string[] };
  cta: { heading: string; text: string; primaryLabel: string; secondaryLabel: string };
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

/** Live content_blocks key (server-side source of truth). */
export const WHOLESALE_CONTENT_KEY = "wholesale";
/** Legacy browser-only key, used solely by the editor's import action. */
export const WHOLESALE_STORAGE_KEY = "talknestbd-wholesale-v1";

export const wholesaleIconKeys: { key: WholesaleIconKey; label: string }[] = [
  { key: "percent", label: "Percent" },
  { key: "truck", label: "Delivery" },
  { key: "package", label: "Package" },
  { key: "support", label: "Support" },
  { key: "library", label: "Library" },
  { key: "school", label: "School" },
  { key: "store", label: "Store" },
  { key: "users", label: "Community" },
];

export const wholesaleDefaults: WholesaleContent = {
  home: {
    eyebrow: "Books for organisations",
    title: "Build a better library for less",
    description:
      "Simple ordering and better prices for schools, libraries, offices, bookshops and reading clubs.",
    wholesale: {
      badge: "Wholesale orders",
      heading: "More books. Better pricing. One helpful team.",
      text: "Order 10 copies or more and receive a tailored quote, priority dispatch and support from selection through delivery.",
      cta: "Get a wholesale quote",
      benefits: ["Special bulk pricing", "Dedicated support", "Nationwide delivery"],
    },
    freeOrder: {
      badge: "Free delivery",
      label: "Delivery offer",
      heading: "Free nationwide delivery over ৳999",
      text: "Selected books ship free at any order value.",
      cta: "See delivery details",
    },
  },
  page: {
    hero: {
      eyebrow: "Wholesale Program",
      title: "Wholesale orders: more books, more savings",
      description:
        "Libraries, schools, mosques, reading clubs and businesses can order in bulk and get a special commission. Tell us what you need and we will send a tailored quote within one business day.",
      badges: ["From 10 copies", "10–20% commission", "Nationwide delivery"],
    },
    priceList: {
      heading: "Wholesale price list",
      note: "Commission varies slightly by book type; the final quote is confirmed after your request.",
      footer: "Minimum order: 10 copies · Indicative price list",
      termsLabel: "View terms",
    },
    tiers: [
      {
        id: "tier-1",
        name: "Starter",
        quantity: "10–25 copies",
        commission: "10%",
        delivery: "৳60 flat",
        highlight: false,
      },
      {
        id: "tier-2",
        name: "Library",
        quantity: "26–50 copies",
        commission: "15%",
        delivery: "Free delivery",
        highlight: true,
      },
      {
        id: "tier-3",
        name: "Institution",
        quantity: "51–100 copies",
        commission: "20%",
        delivery: "Free delivery",
        highlight: false,
      },
      {
        id: "tier-4",
        name: "Bulk Partner",
        quantity: "100+ copies",
        commission: "Custom quote",
        delivery: "Free + priority",
        highlight: false,
      },
    ],
    benefits: [
      {
        id: "benefit-1",
        icon: "percent",
        title: "10% to 20% commission",
        text: "Better rates as your order grows, confirmed in your quote.",
      },
      {
        id: "benefit-2",
        icon: "truck",
        title: "Nationwide delivery",
        text: "We ship to Dhaka and every district in Bangladesh.",
      },
      {
        id: "benefit-3",
        icon: "package",
        title: "Bulk packaging",
        text: "Neatly packed and labelled so shelving is easy.",
      },
      {
        id: "benefit-4",
        icon: "support",
        title: "Dedicated support",
        text: "One helpful contact from selection through delivery.",
      },
    ],
    popularHeading: "Popular wholesale picks",
    catalogueLabel: "Full catalogue",
    whoHeading: "Who can place a wholesale order",
    who: [
      "Libraries and reading centres",
      "Schools, colleges and madrasas",
      "Bookshops and resellers",
      "Clubs, mosques and community centres",
    ],
    faqHeading: "Common questions",
    faqs: [
      {
        id: "faq-1",
        question: "What is the minimum order?",
        answer:
          "Wholesale pricing starts at 10 copies. You can mix titles from the catalogue to reach the minimum.",
      },
      {
        id: "faq-2",
        question: "How does payment work?",
        answer:
          "Payment terms are confirmed with your quote before any order is processed.",
      },
      {
        id: "faq-3",
        question: "Will the books be in stock?",
        answer:
          "Stock is confirmed after you submit a request and before we issue the final quote.",
      },
      {
        id: "faq-4",
        question: "Do you provide invoices and VAT documents?",
        answer:
          "Yes, institutional invoices can be arranged. Add a note in the request form if you need one.",
      },
      {
        id: "faq-5",
        question: "How quickly do I get a quote?",
        answer:
          "We aim to reply within one business day. For a faster answer, use the WhatsApp link on this page.",
      },
    ],
    whatsapp: {
      heading: "Need a quote fast?",
      text: "Message our team on WhatsApp with your book list and quantity for a quicker reply.",
      linkLabel: "Contact on WhatsApp",
    },
    bottomCta: {
      text: "Need a special package for your organisation? Start from 10+ copies.",
      label: "Talk to us",
    },
  },
  freeOrderPage: {
    hero: {
      eyebrow: "Free Delivery",
      title: "Free delivery nationwide on orders of ৳999+",
      description:
        "Shop the books you love and let us handle the delivery. Orders over ৳999 ship free anywhere in Bangladesh.",
      badges: ["Nationwide delivery", "Save on shipping", "No hidden charges"],
    },
    intro: {
      heading: "Good books, delivered without the extra cost",
      text: "Fill your cart with titles over the free-delivery threshold and the shipping charge is on us — no coupon needed.",
      note: "Delivery timelines are confirmed when your wholesale quote is issued.",
    },
    steps: [
      { id: "fo-step-1", title: "Pick your books", text: "Add titles to your cart from the catalogue." },
      { id: "fo-step-2", title: "Reach ৳999", text: "Your cart qualifies for free nationwide delivery." },
      { id: "fo-step-3", title: "We deliver", text: "Choose your preferred delivery method at checkout." },
    ],
    charges: {
      heading: "Delivery charges at a glance",
      description: "Indicative charges for orders below the free-delivery threshold.",
      zones: [
        { id: "zone-1", label: "Dhaka city", charge: "৳60" },
        { id: "zone-2", label: "Outside Dhaka", charge: "৳120" },
        { id: "zone-3", label: "Remote areas", charge: "৳150" },
      ],
    },
    goodToKnow: {
      heading: "Good to know",
      items: [
        "Free delivery applies automatically at checkout.",
        "Delivery times vary by district and courier coverage.",
        "Cash on delivery is available across Bangladesh.",
        "Shipment details are confirmed with your quote.",
      ],
    },
    cta: {
      heading: "Ready to browse?",
      text: "Find your next read and enjoy free delivery on orders over ৳999.",
      primaryLabel: "Browse books",
      secondaryLabel: "Ask a question",
    },
  },
};

export function cloneWholesaleDefaults(): WholesaleContent {
  return JSON.parse(JSON.stringify(wholesaleDefaults)) as WholesaleContent;
}

function strings(value: unknown): value is string[] {
  return Array.isArray(value) && value.every((item) => typeof item === "string");
}

function validHome(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const home = value as Record<string, unknown>;
  const wholesale = home.wholesale as Record<string, unknown> | undefined;
  const freeOrder = home.freeOrder as Record<string, unknown> | undefined;
  return (
    typeof home.eyebrow === "string" &&
    typeof home.title === "string" &&
    typeof home.description === "string" &&
    !!wholesale &&
    typeof wholesale.badge === "string" &&
    typeof wholesale.heading === "string" &&
    typeof wholesale.text === "string" &&
    typeof wholesale.cta === "string" &&
    strings(wholesale.benefits) &&
    !!freeOrder &&
    typeof freeOrder.badge === "string" &&
    typeof freeOrder.label === "string" &&
    typeof freeOrder.heading === "string" &&
    typeof freeOrder.text === "string" &&
    typeof freeOrder.cta === "string"
  );
}

function validPage(value: unknown): boolean {
  if (!value || typeof value !== "object") return false;
  const page = value as Record<string, unknown>;
  return (
    !!page.hero &&
    typeof page.hero === "object" &&
    strings((page.hero as Record<string, unknown>).badges) &&
    !!page.priceList &&
    Array.isArray(page.tiers) &&
    Array.isArray(page.benefits) &&
    typeof page.popularHeading === "string" &&
    typeof page.catalogueLabel === "string" &&
    typeof page.whoHeading === "string" &&
    strings(page.who) &&
    typeof page.faqHeading === "string" &&
    Array.isArray(page.faqs) &&
    !!page.whatsapp &&
    !!page.bottomCta
  );
}

export function readWholesaleContent(): WholesaleContent {
  const defaults = cloneWholesaleDefaults();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(WHOLESALE_STORAGE_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<WholesaleContent>;
    if (!validHome(parsed.home) || !validPage(parsed.page)) return defaults;
    return {
      home: {
        ...defaults.home,
        ...parsed.home,
        wholesale: { ...defaults.home.wholesale, ...parsed.home!.wholesale },
        freeOrder: { ...defaults.home.freeOrder, ...parsed.home!.freeOrder },
      },
      page: { ...defaults.page, ...parsed.page },
      freeOrderPage: {
        ...defaults.freeOrderPage,
        ...(parsed.freeOrderPage ?? {}),
      },
    };
  } catch {
    return defaults;
  }
}

export function writeWholesaleContent(content: WholesaleContent): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(WHOLESALE_STORAGE_KEY, JSON.stringify(content));
    return { ok: true, message: "Saved to this browser — the wholesale pages updated." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearWholesaleContent(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(WHOLESALE_STORAGE_KEY);
    return { ok: true, message: "Restored the original wholesale content." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
