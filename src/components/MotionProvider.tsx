"use client";

import { MotionConfig } from "motion/react";
import type { ReactNode } from "react";
import { EASE_PREMIUM } from "./Motion";

/**
 * One place to say "respect the visitor’s motion setting", so no component has
 * to remember to. Also sets the house transition, so anything animated without
 * an explicit one still moves in the site’s own accent.
 */
export default function MotionProvider({ children }: { children: ReactNode }) {
  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.7, ease: EASE_PREMIUM }}>
      {children}
    </MotionConfig>
  );
}
