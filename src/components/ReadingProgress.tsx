"use client";

import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";

/**
 * How far through the extract you are, drawn as a hairline along the bottom
 * edge of the navbar. It answers a question the reader is already asking, which
 * is the only reason it is allowed to move on its own.
 */
export default function ReadingProgress() {
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll();
  const drawn = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 });

  if (reduced) return null;

  return (
    <motion.span
      aria-hidden="true"
      className="bg-ink fixed left-0 z-[75] h-px w-full origin-left"
      style={{ top: "calc(var(--nav-h) - 1px)", scaleX: drawn }}
    />
  );
}
