import Link from "next/link";
import Button from "./Button";
import Folio from "./Folio";
import { MaskedLines } from "./Motion";
import { folios } from "@/lib/site";

/**
 * The last page: an invitation, set centred with nothing else on the sheet.
 * The only arrow on the site lives here, on the only button that matters.
 */
export default function CTASection() {
  return (
    <section
      className="on-ink grain-ink bg-ink text-paper relative"
      data-nav-tone="paper"
      aria-labelledby="cta-title"
    >
      <div className="above-grain shell py-28 text-center sm:py-40">
        <Folio
          n={folios.close.n}
          head={folios.close.head}
          tone="paper"
          className="justify-center"
        />

        <h2 id="cta-title" className="t-display-l mx-auto mt-14 max-w-[24ch]">
          <MaskedLines lines={["Have a story to tell?"]} onScroll />
          <span className="block italic">
            <MaskedLines lines={["Let’s give it a voice."]} onScroll delay={0.12} />
          </span>
        </h2>

        <p className="t-body text-paper/65 mx-auto mt-10 max-w-[46ch]">
          Submissions are open all year. Send the first fifty pages and a page about what
          the book is for; an editor will write back within six weeks.
        </p>

        <div className="mt-14 flex flex-col items-center gap-7 sm:flex-row sm:justify-center sm:gap-8">
          <Button href="/publish#submit" variant="paper" arrow>
            Start writing
          </Button>
          <Link href="/publish#how" className="link-rule text-paper/70 text-[0.9375rem]">
            How publishing works
          </Link>
        </div>
      </div>
    </section>
  );
}
