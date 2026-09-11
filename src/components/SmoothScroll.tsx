"use client";

import { useEffect } from "react";
import Lenis from "lenis";
import { registerScroller } from "@/lib/scroll";

/**
 * Momentum scrolling. Off entirely when the visitor has asked for reduced
 * motion — in that case the browser’s own scrolling is the correct behaviour,
 * not a shortened version of ours.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const lenis = new Lenis({
      duration: 1.05,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      touchMultiplier: 1.5,
    });

    registerScroller({
      stop: () => lenis.stop(),
      start: () => lenis.start(),
    });

    let frame = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      frame = requestAnimationFrame(raf);
    };
    frame = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(frame);
      registerScroller(null);
      lenis.destroy();
    };
  }, []);

  return null;
}
