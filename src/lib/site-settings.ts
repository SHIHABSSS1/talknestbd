/** Admin-managed storefront settings. Persisted in localStorage (demo only). */

import { siteConfig } from "@/lib/utils";

export interface SiteSettings {
  identity: {
    name: string;
    tagline: string;
    description: string;
    initials: string;
    email: string;
    phone: string;
    whatsapp: string;
    address: string;
  };
  social: {
    facebook: string;
    telegram: string;
    youtube: string;
    instagram: string;
    messenger: string;
  };
  commerce: {
    freeDeliveryThreshold: number;
    sellUsedBookRate: number;
    cod: boolean;
    bkash: boolean;
    nagad: boolean;
    express: boolean;
    wholesale: boolean;
    autoPublishReviews: boolean;
  };
  seo: {
    siteUrl: string;
    gscVerification: string;
    bingVerification: string;
    googleAnalyticsId: string;
    tagManagerId: string;
    twitterHandle: string;
    robotsIndex: boolean;
  };
  tracking: {
    facebookPixelId: string;
    facebookApiToken: string;
    testEventCode: string;
    pixelEnabled: boolean;
    serverSideEnabled: boolean;
    events: string[];
  };
  notifications: {
    newOrders: boolean;
    newReviews: boolean;
    newStories: boolean;
    newSellRequests: boolean;
    weeklyDigest: boolean;
  };
}

export interface SaveResult {
  ok: boolean;
  message: string;
}

export const SITE_SETTINGS_KEY = "talknestbd-site-settings-v1";

export const siteSettingsDefaults: SiteSettings = {
  identity: {
    name: siteConfig.name,
    tagline: siteConfig.tagline,
    description: siteConfig.description,
    initials: "TN",
    email: siteConfig.email,
    phone: siteConfig.phone,
    whatsapp: siteConfig.whatsapp,
    address: siteConfig.address,
  },
  social: {
    facebook: siteConfig.facebook,
    telegram: siteConfig.telegram,
    youtube: siteConfig.youtube,
    instagram: "",
    messenger: "https://m.me/talknestbd",
  },
  commerce: {
    freeDeliveryThreshold: siteConfig.freeDeliveryThreshold,
    sellUsedBookRate: siteConfig.sellUsedBookRate,
    cod: true,
    bkash: true,
    nagad: true,
    express: true,
    wholesale: true,
    autoPublishReviews: false,
  },
  seo: {
    siteUrl: "https://talknestbd.example.com",
    gscVerification: "",
    bingVerification: "",
    googleAnalyticsId: "",
    tagManagerId: "",
    twitterHandle: "@talknestbd",
    robotsIndex: true,
  },
  tracking: {
    facebookPixelId: "",
    facebookApiToken: "",
    testEventCode: "",
    pixelEnabled: false,
    serverSideEnabled: false,
    events: ["PageView", "ViewContent", "AddToCart", "Purchase"],
  },
  notifications: {
    newOrders: true,
    newReviews: true,
    newStories: true,
    newSellRequests: true,
    weeklyDigest: false,
  },
};

export function cloneSiteSettings(): SiteSettings {
  return JSON.parse(JSON.stringify(siteSettingsDefaults)) as SiteSettings;
}

export function readSiteSettings(): SiteSettings {
  const defaults = cloneSiteSettings();
  if (typeof window === "undefined") return defaults;
  try {
    const raw = window.localStorage.getItem(SITE_SETTINGS_KEY);
    if (!raw) return defaults;
    const parsed = JSON.parse(raw) as Partial<SiteSettings>;
    return {
      identity: { ...defaults.identity, ...parsed.identity },
      social: { ...defaults.social, ...parsed.social },
      commerce: { ...defaults.commerce, ...parsed.commerce },
      seo: { ...defaults.seo, ...parsed.seo },
      tracking: {
        ...defaults.tracking,
        ...parsed.tracking,
        events: Array.isArray(parsed.tracking?.events)
          ? parsed.tracking.events
          : defaults.tracking.events,
      },
      notifications: { ...defaults.notifications, ...parsed.notifications },
    };
  } catch {
    return defaults;
  }
}

export function writeSiteSettings(settings: SiteSettings): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.setItem(SITE_SETTINGS_KEY, JSON.stringify(settings));
    return { ok: true, message: "Settings saved to this browser." };
  } catch {
    return { ok: false, message: "Could not save: browser storage may be full." };
  }
}

export function clearSiteSettings(): SaveResult {
  if (typeof window === "undefined") {
    return { ok: false, message: "Storage is not available while rendering on the server." };
  }
  try {
    window.localStorage.removeItem(SITE_SETTINGS_KEY);
    return { ok: true, message: "Settings restored to defaults." };
  } catch {
    return { ok: false, message: "Could not reset browser storage." };
  }
}
