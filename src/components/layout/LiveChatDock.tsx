"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { MessagesSquare, Phone, X } from "lucide-react";
import { cn, siteConfig } from "@/lib/utils";
import {
  FacebookIcon,
  TelegramIcon,
  WhatsAppIcon,
} from "@/components/layout/SocialLinks";

const messengerUrl = "https://m.me/talknestbd";

const channels = [
  {
    key: "whatsapp",
    label: "WhatsApp",
    description: "Fastest way to reach us",
    href: siteConfig.whatsapp,
    external: true,
    tint: "bg-[#25D366]",
    icon: WhatsAppIcon,
  },
  {
    key: "messenger",
    label: "Messenger",
    description: "Chat with us on Facebook",
    href: messengerUrl,
    external: true,
    tint: "bg-clay-600",
    icon: FacebookIcon,
  },
  {
    key: "telegram",
    label: "Telegram",
    description: "Join our reader channel",
    href: siteConfig.telegram,
    external: true,
    tint: "bg-[#229ED9]",
    icon: TelegramIcon,
  },
  {
    key: "live-chat",
    label: "Live chat",
    description: "Talk to customer care",
    href: "/contact",
    external: false,
    tint: "bg-brand-600",
    icon: MessagesSquare,
  },
] as const;

export function LiveChatDock() {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    closeButtonRef.current?.focus();

    const onPointerDown = (event: PointerEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
        triggerRef.current?.focus();
      }
    };

    window.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("pointerdown", onPointerDown);
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div
      ref={containerRef}
      className="print-hide fixed bottom-[76px] right-3 z-40 flex flex-col items-end md:bottom-6 md:right-4"
    >
      {open && (
        <div
          id="talknest-live-chat"
          role="dialog"
          aria-label="Contact TalkNest"
          className="mb-3 max-h-[calc(100dvh-170px)] w-[min(21rem,calc(100vw-1.5rem))] origin-bottom-right animate-fade-up overflow-y-auto overscroll-contain rounded-2xl border border-line bg-white shadow-[0_24px_60px_-24px_rgba(16,24,40,0.45)]"
        >
          <div className="relative overflow-hidden bg-brand-600 px-4 py-4 text-white">
            <span
              aria-hidden="true"
              className="absolute -right-8 -top-10 h-28 w-28 rounded-full border border-white/15"
            />
            <span
              aria-hidden="true"
              className="absolute -right-2 -top-4 h-16 w-16 rounded-full border border-white/15"
            />
            <button
              ref={closeButtonRef}
              type="button"
              onClick={() => {
                setOpen(false);
                triggerRef.current?.focus();
              }}
              aria-label="Close contact options"
              className="absolute right-2 top-2 grid h-8 w-8 place-items-center rounded-full text-white/75 transition-colors hover:bg-white/15 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <X size={16} />
            </button>
            <p className="text-[9px] font-medium uppercase tracking-[0.18em] text-white/65">
              TalkNest support
            </p>
            <h2 className="mt-1 text-base font-bold">How can we help?</h2>
            <p className="mt-0.5 text-[10px] text-white/70">
              We reply every day, 10am–8pm.
            </p>
          </div>

          <div className="p-2">
            {channels.map((channel) => {
              const Icon = channel.icon;
              const content = (
                <>
                  <span
                    className={cn(
                      "grid h-9 w-9 shrink-0 place-items-center rounded-full text-white",
                      channel.tint,
                    )}
                  >
                    <Icon size={17} />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12px] font-semibold text-ink">
                      {channel.label}
                    </span>
                    <span className="block text-[10px] text-muted">
                      {channel.description}
                    </span>
                  </span>
                </>
              );

              return channel.external ? (
                <a
                  key={channel.key}
                  href={channel.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {content}
                </a>
              ) : (
                <Link
                  key={channel.key}
                  href={channel.href}
                  onClick={() => setOpen(false)}
                  className="flex items-center gap-3 rounded-xl px-2.5 py-2.5 transition-colors hover:bg-brand-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500"
                >
                  {content}
                </Link>
              );
            })}
          </div>

          <div className="border-t border-line bg-canvas/70 px-4 py-2.5 text-center text-[10px] text-muted">
            Prefer to call?{" "}
            <a
              href={`tel:${siteConfig.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-1 font-semibold text-brand-700 hover:text-brand-800"
            >
              <Phone size={10} />
              {siteConfig.phone}
            </a>
          </div>
        </div>
      )}

      <button
        ref={triggerRef}
        type="button"
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-controls={open ? "talknest-live-chat" : undefined}
        aria-label={open ? "Close contact options" : "Open contact options"}
        className="grid h-[54px] w-[54px] place-items-center rounded-full bg-brand-600 text-white shadow-[0_16px_36px_-14px_rgba(24,119,242,0.85)] transition-transform duration-200 hover:scale-105 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
      >
        {open ? <X size={22} /> : <MessagesSquare size={23} />}
      </button>
    </div>
  );
}
