"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";
import type { PointerEvent as ReactPointerEvent, ReactNode } from "react";

type Props = {
  children: ReactNode;
  href?: string;
  variant?: "ink" | "paper" | "outline";
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit";
  onClick?: () => void;
  "aria-label"?: string;
};

const PULL = 0.16;
const LIMIT = 6;

/**
 * Buttons lean very slightly towards the pointer, then invert on hover: the ink
 * drains downward and leaves paper behind. The pull is capped at six pixels —
 * enough to feel answered, not enough to feel like a toy.
 */
export default function Button({
  children,
  href,
  variant = "ink",
  arrow = false,
  className = "",
  type = "button",
  onClick,
  "aria-label": ariaLabel,
}: Props) {
  const reduced = useReducedMotion();

  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 260, damping: 26, mass: 0.4 });
  const y = useSpring(my, { stiffness: 260, damping: 26, mass: 0.4 });

  const onMove = (event: ReactPointerEvent<HTMLSpanElement>) => {
    if (reduced) return;
    const rect = event.currentTarget.getBoundingClientRect();
    const dx = event.clientX - (rect.left + rect.width / 2);
    const dy = event.clientY - (rect.top + rect.height / 2);
    mx.set(Math.max(-LIMIT, Math.min(LIMIT, dx * PULL)));
    my.set(Math.max(-LIMIT, Math.min(LIMIT, dy * PULL)));
  };

  const reset = () => {
    mx.set(0);
    my.set(0);
  };

  const classes = `btn btn-${variant} ${className}`.trim();

  const inner = (
    <>
      <span>{children}</span>
      {arrow ? (
        <ArrowRight className="btn-arrow" size={16} strokeWidth={1.25} aria-hidden="true" />
      ) : null}
    </>
  );

  return (
    <motion.span
      className="inline-flex"
      style={{ x, y }}
      onPointerMove={onMove}
      onPointerLeave={reset}
    >
      {href ? (
        <Link href={href} className={classes} aria-label={ariaLabel} onClick={onClick}>
          {inner}
        </Link>
      ) : (
        <button type={type} onClick={onClick} className={classes} aria-label={ariaLabel}>
          {inner}
        </button>
      )}
    </motion.span>
  );
}
