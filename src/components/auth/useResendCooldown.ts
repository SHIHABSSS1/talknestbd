"use client";

import { useEffect, useState } from "react";

/** Client-side resend throttle that mirrors the server's rate-limit window. */
export function useResendCooldown(seconds = 60) {
  const [remaining, setRemaining] = useState(0);
  const active = remaining > 0;

  useEffect(() => {
    if (!active) return;
    const id = window.setInterval(() => {
      setRemaining((value) => Math.max(0, value - 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [active]);

  function start(value = seconds) {
    setRemaining(value);
  }

  return { remaining, active, start };
}
