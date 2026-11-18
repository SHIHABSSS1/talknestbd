"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  clearSiteSettings,
  cloneSiteSettings,
  readSiteSettings,
  SITE_SETTINGS_KEY,
  writeSiteSettings,
  type SaveResult,
  type SiteSettings,
} from "@/lib/site-settings";

interface SiteSettingsContextValue {
  settings: SiteSettings;
  hydrated: boolean;
  save: (next: SiteSettings) => SaveResult;
  reset: () => SaveResult;
}

const SiteSettingsContext = createContext<SiteSettingsContextValue | null>(null);
const initialSettings: SiteSettings = cloneSiteSettings();

export function SiteSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<SiteSettings>(initialSettings);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setSettings(readSiteSettings());
    setHydrated(true);
    const onStorage = (event: StorageEvent) => {
      if (event.key === SITE_SETTINGS_KEY || event.key === null) {
        setSettings(readSiteSettings());
      }
    };
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, []);

  const save = useCallback((next: SiteSettings) => {
    const result = writeSiteSettings(next);
    if (result.ok) setSettings(next);
    return result;
  }, []);

  const reset = useCallback(() => {
    const result = clearSiteSettings();
    if (result.ok) setSettings(cloneSiteSettings());
    return result;
  }, []);

  const value = useMemo(
    () => ({ settings, hydrated, save, reset }),
    [settings, hydrated, save, reset],
  );

  return (
    <SiteSettingsContext.Provider value={value}>
      {children}
    </SiteSettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettingsContextValue {
  const context = useContext(SiteSettingsContext);
  if (!context) {
    throw new Error("useSiteSettings must be used within a SiteSettingsProvider");
  }
  return context;
}
