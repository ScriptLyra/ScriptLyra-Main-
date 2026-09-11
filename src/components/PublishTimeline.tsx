"use client";

import { useRef } from "react";
import { motion, useReducedMotion, useScroll, useSpring } from "motion/react";
import Button from "./Button";
import SectionHeading from "./SectionHeading";
import { Reveal } from "./Motion";
import { folios } from "@/lib/site";

/** A real sequence — which is why it is the one place on the page with numbers. */
const steps = [
  {
    n: "01",
    title: "Write",
    body: "Bring us a finished draft, or the part of one you trust. Every submission is read by an editor, and every submission gets an answer.",
  },
  {
    n: "02",
    title: "Edit",
    body: "Two passes with an editor who has read your influences. Structure first, then sentences — and never the other way round.",
  },
  {
    n: "03",
    title: "Design",
    body: "Type, cover, paper stock, binding. A book is an object before it is ever a purchase, and the object is half the argument.",
  },
  {
    n: "04",
    title: "Publish",
    body: "Print and digital together, with an ISBN registered to you and a contract you can read without a lawyer beside you.",
  },
  {
    n: "05",
    title: "Reach readers",
    body: "The list goes to booksellers, festival programmers, reviewers, and forty thousand readers who have come to take our word for it.",
  },
];

type Props = {
  /**
   * The homepage passage carries a folio. The publishing page passes null —
   * not undefined, which would fall through to the default below.
   */
  folio?: { n: string; head: string } | null;
  lines?: string[];
  lead?: string;
  titleId?: string;
  sectionId?: string;
  cta?: boolean;
};

/**
 * The one orchestrated scroll moment on the page: a rule drawn down the margin
 * at the speed you read, marking off the five stages of making a book. Under
 * reduced motion the rule is simply there, complete.
 */
export default function PublishTimeline({
  folio = folios.publish,
  lines = ["Your story deserves", "a place in the world."],
  lead = "What happens between the manuscript you send and the book on a shelf. Five stages, roughly nine months, no mystery about any of it.",
  titleId = "publish-title",
  sectionId,
  cta = true,
}: Props) {
  const rail = useRef<HTMLOListElement>(null);
  const reduced = useReducedMotion();

  const { scrollYProgress } = useScroll({
    target: rail,
    offset: ["start 78%", "end 72%"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 90, damping: 28, mass: 0.4 });

  return (
    <section
      id={sectionId}
      className="grain-paper bg-leaf relative scroll-mt-20"
      data-nav-tone="ink"
      aria-labelledby={titleId}
    >
      <div className="above-grain shell py-24 sm:py-32 lg:py-40">
        <hr className="crease mb-14" />

        <SectionHeading folio={folio} id={titleId} lines={lines} lead={lead} />

        <ol ref={rail} className="border-rule relative mt-20 border-l pl-8 sm:mt-24 sm:pl-14">
          <motion.span
            aria-hidden="true"
            className="bg-ink absolute top-0 -left-px w-px origin-top"
            style={{ height: "100%", scaleY: reduced ? 1 : drawn }}
          />

          {steps.map((step) => (
            <li key={step.n} className="relative pb-14 last:pb-0">
              <Reveal y={18}>
                <div className="grid gap-x-10 gap-y-4 lg:grid-cols-12">
                  <div className="flex items-baseline gap-4 lg:col-span-4">
                    <span className="t-numeral text-graphite text-[1.5rem] leading-none">
                      {step.n}
                    </span>
                    <h3 className="t-display-m">{step.title}</h3>
                  </div>
                  <p className="t-body lg:col-span-6 lg:col-start-6">{step.body}</p>
                </div>
              </Reveal>
            </li>
          ))}
        </ol>

        {cta ? (
          <Reveal className="mt-16" y={16}>
            <Button href="/publish#submit" variant="ink">
              Send us your manuscript
            </Button>
          </Reveal>
        ) : null}
      </div>
    </section>
  );
}
