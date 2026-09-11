"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "motion/react";
import Lockup from "./Lockup";
import SmoothScroll from "./SmoothScroll";
import { EASE_PREMIUM } from "./Motion";

const IntroContext = createContext(false);

/** True once the opening sequence has finished, so the hero can begin. */
export const useIntroDone = () => useContext(IntroContext);

const KEY = "scriptlyra:intro-played";
const DURATION = 2350;

/**
 * The opening: paper, then the mark folds itself, then the wordmark is laid
 * down left to right, then the sheet lifts away. It plays once per session and
 * can be dismissed with any key or click. Visitors who have asked for reduced
 * motion never see it.
 */
export default function Intro({ children }: { children: ReactNode }) {
  const [state, setState] = useState<"pending" | "playing" | "done">("pending");
  const [played, setPlayed] = useState(false);

  useEffect(() => {
    let seen = false;
    try {
      seen = sessionStorage.getItem(KEY) === "1";
    } catch {
      seen = false;
    }

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (seen || reduced) {
      setState("done");
      return;
    }

    try {
      sessionStorage.setItem(KEY, "1");
    } catch {
      /* private browsing — the intro simply plays again next time */
    }

    setPlayed(true);
    setState("playing");
    const timer = window.setTimeout(() => setState("done"), DURATION);
    return () => window.clearTimeout(timer);
  }, []);

  // Hold the page still while the sheet is down, and let anyone skip past it.
  useEffect(() => {
    if (state !== "playing") return;

    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const skip = () => setState("done");
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    window.addEventListener("wheel", skip, { passive: true });

    return () => {
      document.body.style.overflow = previous;
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
      window.removeEventListener("wheel", skip);
    };
  }, [state]);

  return (
    <IntroContext.Provider value={state === "done"}>
      <AnimatePresence>
        {state !== "done" ? (
          <motion.div
            key="intro"
            className="grain-paper bg-paper fixed inset-0 z-[100] flex flex-col items-center justify-center"
            initial={false}
            exit={played ? { y: "-100%" } : { opacity: 0 }}
            transition={{ duration: played ? 1 : 0, ease: EASE_PREMIUM }}
            aria-hidden="true"
          >
            <div className="above-grain flex flex-col items-center">
              <Lockup
                className="text-ink w-[min(58vw,21rem)]"
                animate
                play={state === "playing"}
                delay={0.25}
              />
              <motion.p
                className="t-micro mt-10"
                initial={{ opacity: 0 }}
                animate={{ opacity: state === "playing" ? 1 : 0 }}
                transition={{ duration: 0.9, ease: EASE_PREMIUM, delay: 1.35 }}
              >
                Stories are loading…
              </motion.p>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>

      {state === "done" ? <SmoothScroll /> : null}
      {children}
    </IntroContext.Provider>
  );
}
