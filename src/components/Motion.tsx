"use client";

import { motion, useReducedMotion, type Variants } from "motion/react";
import { Fragment, type CSSProperties, type ReactNode } from "react";

/**
 * One easing carries every transition on the site: long, decelerating, no
 * overshoot. Declared as a typed tuple so Motion’s `ease` accepts it without
 * widening to number[].
 */
export const EASE_PREMIUM: [number, number, number, number] = [0.16, 1, 0.3, 1];

export const staggerContainer = (stagger = 0.08, delayChildren = 0): Variants => ({
  hidden: {},
  shown: {
    transition: { staggerChildren: stagger, delayChildren },
  },
});

export const fadeUpItem = (y = 22, duration = 0.9): Variants => ({
  hidden: { opacity: 0, y },
  shown: { opacity: 1, y: 0, transition: { duration, ease: EASE_PREMIUM } },
});

type RevealProps = {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  delay?: number;
  y?: number;
  duration?: number;
};

/**
 * Scroll-in reveal. Used sparingly — on the passages that open a section, not
 * on every element, so arriving at a section still feels like arriving.
 */
export function Reveal({
  children,
  className,
  style,
  delay = 0,
  y = 22,
  duration = 0.9,
}: RevealProps) {
  const reduced = useReducedMotion();

  return (
    <motion.div
      className={className}
      style={style}
      initial={reduced ? { opacity: 0 } : { opacity: 0, y }}
      whileInView={reduced ? { opacity: 1 } : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-8% 0px -12% 0px" }}
      transition={{ duration: reduced ? 0.35 : duration, ease: EASE_PREMIUM, delay }}
    >
      {children}
    </motion.div>
  );
}

type MaskedLinesProps = {
  lines: string[];
  /** Play immediately, or wait for the intro to finish. */
  play?: boolean;
  delay?: number;
  stagger?: number;
  duration?: number;
  /** Reveal on scroll instead of on mount. */
  onScroll?: boolean;
};

/**
 * Line-by-line reveal behind a mask: each line rises out of its own clipped
 * box, the way a line of type comes off a press. Not a fade — the edge matters.
 */
export function MaskedLines({
  lines,
  play = true,
  delay = 0,
  stagger = 0.085,
  duration = 1.05,
  onScroll = false,
}: MaskedLinesProps) {
  const reduced = useReducedMotion();

  return (
    <>
      {lines.map((line, i) => {
        const transition = {
          duration: reduced ? 0.4 : duration,
          ease: EASE_PREMIUM,
          delay: reduced ? 0 : delay + i * stagger,
        };

        const hidden = reduced ? { opacity: 0 } : { y: "108%" };
        const shown = reduced ? { opacity: 1 } : { y: "0%" };

        return (
          <span key={line + i} className="block overflow-hidden pb-[0.06em]">
            <motion.span
              className="block will-change-transform"
              initial={hidden}
              animate={onScroll ? undefined : play ? shown : hidden}
              whileInView={onScroll ? shown : undefined}
              viewport={onScroll ? { once: true, margin: "-10% 0px -10% 0px" } : undefined}
              transition={transition}
            >
              {line}
            </motion.span>
          </span>
        );
      })}
    </>
  );
}

type WordsProps = {
  text: string;
  className?: string;
  /** Words brighten one at a time as the passage scrolls through. */
  stagger?: number;
};

/**
 * Word-by-word emphasis for the manifesto. Each word sits at low opacity and
 * comes up to full as it enters — reading, rather than a section transition.
 */
export function Words({ text, className, stagger = 0.05 }: WordsProps) {
  const reduced = useReducedMotion();
  const words = text.split(" ");

  if (reduced) {
    return <span className={className}>{text}</span>;
  }

  return (
    <motion.span
      className={className}
      initial="hidden"
      whileInView="shown"
      viewport={{ once: true, margin: "-14% 0px -20% 0px" }}
      variants={{ hidden: {}, shown: { transition: { staggerChildren: stagger } } }}
    >
      {words.map((word, i) => (
        // The space sits outside the inline-block: kept inside it, the line box
        // trims it and the words run together.
        <Fragment key={word + i}>
          <motion.span
            className="inline-block"
            variants={{
              hidden: { opacity: 0.14, y: 12 },
              shown: { opacity: 1, y: 0, transition: { duration: 0.85, ease: EASE_PREMIUM } },
            }}
          >
            {word}
          </motion.span>
          {i < words.length - 1 ? " " : null}
        </Fragment>
      ))}
    </motion.span>
  );
}
