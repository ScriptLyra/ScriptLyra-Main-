"use client";

import { motion } from "motion/react";
import Button from "./Button";
import Folio from "./Folio";
import OrigamiBird from "./OrigamiBird";
import { MaskedLines, EASE_PREMIUM } from "./Motion";
import { useIntroDone } from "./Intro";
import { folios } from "@/lib/site";

/**
 * The hero waits for the opening sequence to lift, then sets the headline line
 * by line — the only place on the site where type runs to nine and a half rem.
 * The mark folds itself into the upper right and breathes there.
 */
export default function Hero() {
  const play = useIntroDone();

  const settle = (delay: number) => ({
    initial: { opacity: 0, y: 16 },
    animate: play ? { opacity: 1, y: 0 } : { opacity: 0, y: 16 },
    transition: { duration: 1, ease: EASE_PREMIUM, delay },
  });

  return (
    <section
      className="grain-paper relative overflow-hidden pt-[var(--nav-h)]"
      aria-labelledby="hero-title"
    >
      <div className="above-grain shell relative flex min-h-[calc(100svh-var(--nav-h))] flex-col pb-14 sm:pb-20">
        <div className="pt-8 sm:pt-12">
          <motion.div {...settle(0.05)}>
            <Folio n={folios.hero.n} head={folios.hero.head} />
          </motion.div>
        </div>

        <motion.div
          className="pointer-events-none absolute top-[15vh] right-0 w-[clamp(5.5rem,13vw,12rem)] sm:right-[3vw]"
          animate={{ y: [0, -12, 0] }}
          transition={{ duration: 8.5, repeat: Infinity, ease: "easeInOut" }}
          aria-hidden="true"
        >
          <OrigamiBird className="text-ink w-full" play={play} delay={0.3} />
        </motion.div>

        <div className="mt-auto">
          <h1 id="hero-title" className="t-display-xl max-w-[15ch]">
            <MaskedLines
              lines={["Where stories", "find their voice."]}
              play={play}
              delay={0.14}
              stagger={0.095}
            />
          </h1>

          <hr className="crease mt-12 mb-10 sm:mt-16" />

          <div className="grid gap-10 md:grid-cols-12 md:items-end">
            <motion.p className="t-lead md:col-span-5" {...settle(0.72)}>
              A publishing house and a workshop: read the list, meet the people who wrote
              it, and bring us the manuscript you have been circling for years.
            </motion.p>

            <motion.div
              className="flex flex-wrap items-center gap-3 md:col-span-6 md:col-start-7 md:justify-end"
              {...settle(0.86)}
            >
              <Button href="/explore" variant="ink">
                Explore stories
              </Button>
              <Button href="/publish#submit" variant="outline">
                Publish your work
              </Button>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
