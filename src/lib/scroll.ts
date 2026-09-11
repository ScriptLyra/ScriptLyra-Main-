"use client";

import { useEffect } from "react";

/**
 * Overlays need the page behind them to hold still. That means stopping both
 * the native scroll and the momentum scroller, so the momentum scroller
 * registers itself here rather than being reached for directly.
 */
type Controls = { stop: () => void; start: () => void };

let controls: Controls | null = null;

export function registerScroller(next: Controls | null) {
  controls = next;
}

export function useScrollLock(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    const previousPad = body.style.paddingRight;
    const gutter = window.innerWidth - document.documentElement.clientWidth;

    controls?.stop();
    body.style.overflow = "hidden";
    if (gutter > 0) body.style.paddingRight = `${gutter}px`;

    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPad;
      controls?.start();
    };
  }, [active]);
}

/** Close on Escape — every overlay on the site answers to it. */
export function useEscape(active: boolean, onEscape: () => void) {
  useEffect(() => {
    if (!active) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onEscape();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onEscape]);
}
