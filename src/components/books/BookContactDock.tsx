"use client";

import Link from "next/link";
import { MessagesSquare, Phone } from "lucide-react";
import { siteConfig } from "@/lib/utils";
import { FacebookIcon, WhatsAppIcon } from "@/components/layout/SocialLinks";

const messengerUrl = "https://m.me/talknestbd";

export function BookContactDock() {
  return (
    <div className="print-hide fixed bottom-[76px] right-3 z-40 flex flex-col items-end gap-2.5 sm:right-4 md:bottom-6">
      <a
        href={siteConfig.whatsapp}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="group relative grid h-11 w-11 place-items-center rounded-full bg-[#25D366] text-white shadow-[0_10px_24px_-12px_rgba(37,211,102,0.9)] transition-transform hover:scale-105"
      >
        <WhatsAppIcon size={19} />
        <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-full bg-forest-950 px-3 py-1.5 text-[11px] font-medium text-cream-50 opacity-0 transition-opacity group-hover:opacity-100 md:block">
          WhatsApp us
        </span>
      </a>

      <Link
        href="/contact"
        aria-label="Open live chat"
        className="group relative grid h-11 w-11 place-items-center rounded-full bg-forest-900 text-cream-50 shadow-[0_10px_24px_-12px_rgba(11,61,122,0.9)] transition-transform hover:scale-105"
      >
        <MessagesSquare size={18} />
        <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-full bg-forest-950 px-3 py-1.5 text-[11px] font-medium text-cream-50 opacity-0 transition-opacity group-hover:opacity-100 md:block">
          Live chat
        </span>
      </Link>

      <a
        href={messengerUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Message us on Messenger"
        className="group relative grid h-11 w-11 place-items-center rounded-full bg-clay-600 text-white shadow-[0_10px_24px_-12px_rgba(24,119,242,0.9)] transition-transform hover:scale-105"
      >
        <FacebookIcon size={19} />
        <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-full bg-forest-950 px-3 py-1.5 text-[11px] font-medium text-cream-50 opacity-0 transition-opacity group-hover:opacity-100 md:block">
          Messenger
        </span>
      </a>

      <a
        href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
        aria-label={`Call ${siteConfig.phone}`}
        className="group relative grid h-11 w-11 place-items-center rounded-full border border-forest-900/10 bg-cream-50 text-forest-800 shadow-[0_10px_24px_-14px_rgba(17,24,39,0.5)] transition-transform hover:scale-105"
      >
        <Phone size={17} />
        <span className="pointer-events-none absolute right-full mr-2 hidden whitespace-nowrap rounded-full bg-forest-950 px-3 py-1.5 text-[11px] font-medium text-cream-50 opacity-0 transition-opacity group-hover:opacity-100 md:block">
          Call the shop
        </span>
      </a>
    </div>
  );
}
