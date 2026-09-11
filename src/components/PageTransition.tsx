"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { EASE_PREMIUM } from "./Motion";

/**
 * Moving between pages should feel like a page being turned rather than a
 * screen being replaced: a leaf of paper lifts away off the top of the new
 * page, its bottom edge the only line you actually see. It never intercepts
 * pointer events, and it is skipped entirely for reduced motion.
 */
export default function PageTransition() {
  const pathname = usePathname();
  const reduced = useReducedMotion();
  const previous = useRef<string | null>(null);
  const [turn, setTurn] = useState(0);

  useEffect(() => {
    if (previous.current === null) {
      previous.current = pathname; // first paint belongs to the opening sequence
      return;
    }
    if (previous.current === pathname) return;
    previous.current = pathname;
    setTurn((n) => n + 1);
  }, [pathname]);

  if (reduced) return null;

  return (
    <AnimatePresence>
      {turn > 0 ? (
        <motion.div
          key={turn}
          className="grain-paper bg-leaf pointer-events-none fixed inset-0 z-[95]"
          initial={{ y: "0%" }}
          animate={{ y: "-100%" }}
          transition={{ duration: 0.78, ease: EASE_PREMIUM }}
          aria-hidden="true"
        >
          <span className="bg-rule absolute inset-x-0 bottom-0 h-px" />
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
