import { MaskedLines, Words } from "./Motion";

/**
 * The one passage on the page that argues rather than describes. Set in ink,
 * word by word, at reading speed — the animation is the reading.
 */
export default function Manifesto() {
  return (
    <section
      className="on-ink grain-ink bg-ink text-paper relative"
      data-nav-tone="paper"
      aria-labelledby="manifesto-title"
    >
      <div className="above-grain shell flex min-h-[88svh] flex-col justify-center py-28 sm:py-36">
        <h2 id="manifesto-title" className="t-display-l max-w-[20ch]">
          <Words text="We believe stories shape culture." />
        </h2>

        <hr className="crease-ink mt-14 mb-14" />

        <div className="grid gap-10 lg:grid-cols-12">
          <p className="t-body-serif text-paper/70 lg:col-span-6">
            <Words text="A book changes what a person is able to think. That is a slow, unfashionable kind of power, and it has outlasted every invention built to replace it." />
          </p>
          <p className="t-body-serif text-paper/70 lg:col-span-5 lg:col-start-8">
            <Words text="So we publish for the reader who will still be reading in thirty years, and we make books that will still be worth opening then." />
          </p>
        </div>

        <p className="t-quote text-paper mt-20 text-[clamp(1.25rem,2.4vw,2rem)]">
          <MaskedLines lines={["Nothing here is written for the scroll."]} onScroll />
        </p>
      </div>
    </section>
  );
}
