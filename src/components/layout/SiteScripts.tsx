"use client";

/** Injects verification meta tags and analytics scripts from saved settings.
 * All IDs are strictly validated before use; values come from localStorage. */

import { useEffect } from "react";
import { useSiteSettings } from "@/components/providers/SiteSettingsProvider";

const patterns = {
  verification: /^[A-Za-z0-9_-]{10,200}$/,
  ga4: /^G-[A-Z0-9]{6,20}$/,
  gtm: /^GTM-[A-Z0-9]{4,20}$/,
  pixel: /^\d{6,20}$/,
};

function valid(value: string, pattern: RegExp): string {
  const trimmed = value.trim();
  return pattern.test(trimmed) ? trimmed : "";
}

export function SiteScripts() {
  const { settings } = useSiteSettings();
  const { seo, tracking } = settings;

  useEffect(() => {
    const created: Element[] = [];

    const addMeta = (name: string, value: string) => {
      if (!value || document.querySelector(`meta[name="${name}"][data-talknest]`)) return;
      const meta = document.createElement("meta");
      meta.name = name;
      meta.content = value;
      meta.setAttribute("data-talknest", "1");
      document.head.appendChild(meta);
      created.push(meta);
    };

    addMeta("google-site-verification", valid(seo.gscVerification, patterns.verification));
    addMeta("msvalidate.01", valid(seo.bingVerification, patterns.verification));

    const ga4 = valid(seo.googleAnalyticsId, patterns.ga4);
    if (ga4 && !document.getElementById("tbn-ga4")) {
      const script = document.createElement("script");
      script.id = "tbn-ga4";
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(ga4)}`;
      document.head.appendChild(script);
      created.push(script);

      const inline = document.createElement("script");
      inline.id = "tbn-ga4-inline";
      inline.textContent = `window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config',${JSON.stringify(ga4)});`;
      document.head.appendChild(inline);
      created.push(inline);
    }

    const gtm = valid(seo.tagManagerId, patterns.gtm);
    if (gtm && !document.getElementById("tbn-gtm")) {
      const script = document.createElement("script");
      script.id = "tbn-gtm";
      script.textContent = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer',${JSON.stringify(gtm)});`;
      document.head.appendChild(script);
      created.push(script);
    }

    const pixel = valid(tracking.facebookPixelId, patterns.pixel);
    if (tracking.pixelEnabled && pixel && !document.getElementById("tbn-fb-pixel")) {
      const script = document.createElement("script");
      script.id = "tbn-fb-pixel";
      script.textContent = `!function(f,b,e,v,n,t,s){if(f.fbq)return;n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,'script','https://connect.facebook.net/en_US/fbevents.js');fbq('init',${JSON.stringify(pixel)});fbq('track','PageView');`;
      document.head.appendChild(script);
      created.push(script);
    }

    return () => {
      for (const node of created) node.remove();
    };
  }, [seo.gscVerification, seo.bingVerification, seo.googleAnalyticsId, seo.tagManagerId, tracking.facebookPixelId, tracking.pixelEnabled]);

  return null;
}
