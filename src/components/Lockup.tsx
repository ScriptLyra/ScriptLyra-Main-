"use client";

import { useId } from "react";
import { motion, useReducedMotion } from "motion/react";
import { FACETS } from "./OrigamiBird";
import { EASE_PREMIUM } from "./Motion";

/**
 * The full ScriptLyra™ lockup, assembled in the logo’s own coordinate space:
 * the mark as traced vectors, the wordmark as the original artwork placed at
 * its exact offset. Nothing about the logo is redrawn or re-typeset.
 *
 * Source geometry — mark occupies x 2–113, wordmark x 121–412 at y 18–96.
 */
const VIEW = { w: 414, h: 104 };
const WORD = { x: 121, y: 18, w: 291, h: 78 };

type Props = {
  className?: string;
  tone?: "ink" | "paper";
  /** Fold the mark, then lay the wordmark down left to right. */
  animate?: boolean;
  play?: boolean;
  delay?: number;
  label?: string;
};

export default function Lockup({
  className,
  tone = "ink",
  animate = false,
  play = true,
  delay = 0,
  label = "ScriptLyra",
}: Props) {
  const reduced = useReducedMotion();
  const uid = useId().replace(/[^a-zA-Z0-9]/g, "");
  const clipId = `word-${uid}`;
  const src = tone === "paper" ? "/brand/logo-word-white.png" : "/brand/logo-word.png";
  const still = !animate || reduced;

  const markDelay = delay;
  const wordDelay = delay + 0.42;

  return (
    <svg
      viewBox={`0 0 ${VIEW.w} ${VIEW.h}`}
      className={className}
      fill="currentColor"
      role="img"
      aria-label={label}
    >
      {FACETS.map((facet, i) =>
        still ? (
          <path key={facet.d} d={facet.d} />
        ) : (
          <motion.path
            key={facet.d}
            d={facet.d}
            style={{ transformBox: "fill-box", transformOrigin: facet.hinge }}
            initial={{ opacity: 0, scale: 0.2, rotate: facet.rot }}
            animate={play ? { opacity: 1, scale: 1, rotate: 0 } : undefined}
            transition={{
              duration: 1.05,
              ease: EASE_PREMIUM,
              delay: markDelay + i * 0.07,
            }}
          />
        ),
      )}

      {still ? (
        <image href={src} x={WORD.x} y={WORD.y} width={WORD.w} height={WORD.h} />
      ) : (
        <>
          <defs>
            <clipPath id={clipId}>
              <motion.rect
                x={WORD.x}
                y={WORD.y - 4}
                height={WORD.h + 8}
                initial={{ width: 0 }}
                animate={play ? { width: WORD.w + 4 } : undefined}
                transition={{ duration: 1.15, ease: EASE_PREMIUM, delay: wordDelay }}
              />
            </clipPath>
          </defs>
          <image
            href={src}
            x={WORD.x}
            y={WORD.y}
            width={WORD.w}
            height={WORD.h}
            clipPath={`url(#${clipId})`}
          />
        </>
      )}
    </svg>
  );
}
