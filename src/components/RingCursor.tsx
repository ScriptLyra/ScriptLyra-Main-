"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useReducedMotion, useSpring } from "motion/react";

/**
 * A ring that appears only over surfaces that invite handling — covers,
 * bookplates, the reader. Everywhere else the native cursor is left alone,
 * because replacing it site-wide is a cost with no benefit.
 *
 * Opt in from markup with data-ring="Read", where the value becomes the label.
 */
export default function RingCursor() {
  const reduced = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState<string | null>(null);

  const x = useMotionValue(-200);
  const y = useMotionValue(-200);
  const sx = useSpring(x, { stiffness: 420, damping: 36, mass: 0.5 });
  const sy = useSpring(y, { stiffness: 420, damping: 36, mass: 0.5 });

  useEffect(() => {
    if (reduced) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    setEnabled(true);
    document.documentElement.classList.add("has-ring-cursor");

    const onMove = (event: PointerEvent) => {
      x.set(event.clientX);
      y.set(event.clientY);

      const target = event.target;
      const zone =
        target instanceof Element ? target.closest<HTMLElement>("[data-ring]") : null;
      setLabel(zone ? zone.dataset.ring || "" : null);
    };

    const onLeave = () => setLabel(null);

    window.addEventListener("pointermove", onMove, { passive: true });
    window.addEventListener("pointerleave", onLeave);

    return () => {
      document.documentElement.classList.remove("has-ring-cursor");
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerleave", onLeave);
    };
  }, [reduced, x, y]);

  if (!enabled) return null;

  const visible = label !== null;

  return (
    <motion.div
      className="pointer-events-none fixed top-0 left-0 z-[90] hidden lg:block"
      style={{ x: sx, y: sy }}
      aria-hidden="true"
    >
      <motion.div
        className="border-ink bg-paper/70 text-ink flex items-center justify-center rounded-full border backdrop-blur-[2px]"
        initial={false}
        animate={{
          opacity: visible ? 1 : 0,
          scale: visible ? 1 : 0.4,
          width: label ? 84 : 30,
          height: label ? 84 : 30,
          x: label ? -42 : -15,
          y: label ? -42 : -15,
        }}
        transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
      >
        <span className="t-folio text-ink italic">{label}</span>
      </motion.div>
    </motion.div>
  );
}
