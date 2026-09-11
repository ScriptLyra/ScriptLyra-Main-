"use client";

import { motion, useReducedMotion } from "motion/react";
import { EASE_PREMIUM } from "./Motion";

/**
 * The ScriptLyra mark, traced facet by facet from the brand logo. Seven
 * triangles, separated by the white creases of the original — so it can fold
 * itself rather than fade in as a flat image.
 *
 * Ordered from the body outward, which is the order a crane is actually folded.
 * Coordinate space matches the logo artwork: viewBox 0 0 118 104.
 */
export const FACETS: { d: string; hinge: string; rot: number }[] = [
  { d: "M58 26 82 63 47 63Z", hinge: "50% 100%", rot: -4 }, // body
  { d: "M46 66 82 66 42 85Z", hinge: "50% 0%", rot: 5 }, // belly
  { d: "M70 39 93 27 86 62Z", hinge: "0% 100%", rot: -8 }, // neck
  { d: "M96 26 111 32 95 35Z", hinge: "0% 50%", rot: -11 }, // beak
  { d: "M7 4 55 23 44 61Z", hinge: "100% 100%", rot: -9 }, // upper wing
  { d: "M4 23 18 26 37 56Z", hinge: "100% 100%", rot: -7 }, // lower wing
  { d: "M12 97 43 66 37 90Z", hinge: "100% 0%", rot: 8 }, // tail
];

type Props = {
  className?: string;
  /** Hold folded until true. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Render immediately, no fold. */
  still?: boolean;
  label?: string;
};

export default function OrigamiBird({
  className,
  play = true,
  delay = 0,
  stagger = 0.075,
  duration = 1.1,
  still = false,
  label,
}: Props) {
  const reduced = useReducedMotion();
  const skip = still || reduced;

  return (
    <svg
      viewBox="0 0 118 104"
      className={className}
      fill="currentColor"
      role={label ? "img" : undefined}
      aria-hidden={label ? undefined : true}
    >
      {label ? <title>{label}</title> : null}
      {FACETS.map((facet, i) =>
        skip ? (
          <path key={facet.d} d={facet.d} />
        ) : (
          <motion.path
            key={facet.d}
            d={facet.d}
            style={{ transformBox: "fill-box", transformOrigin: facet.hinge }}
            initial={{ opacity: 0, scale: 0.2, rotate: facet.rot }}
            animate={play ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{ duration, ease: EASE_PREMIUM, delay: delay + i * stagger }}
          />
        ),
      )}
    </svg>
  );
}
