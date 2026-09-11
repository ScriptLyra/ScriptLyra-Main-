import Link from "next/link";
import SectionHeading from "./SectionHeading";
import { Reveal } from "./Motion";
import { authors } from "@/lib/authors";
import { folios } from "@/lib/site";

/**
 * Authors as bookplates: initials struck into paper, the way a press stamps a
 * flyleaf. Opening one turns it to ink and brings up the line they are known
 * for. Name and subject stay in plain text underneath, so nothing important is
 * only available to a mouse.
 */
export default function AuthorsSection() {
  return (
    <section
      className="grain-paper relative"
      data-nav-tone="ink"
      aria-labelledby="authors-title"
    >
      <div className="above-grain shell py-24 sm:py-32 lg:py-40">
        <hr className="crease mb-14" />

        <SectionHeading
          folio={folios.authors}
          id="authors-title"
          lines={["Behind every story", "is a voice."]}
          lead="Twenty-one writers work with the house. These four are the ones people write to us about."
          link={{ label: "All authors", href: "/authors" }}
        />

        <ul className="mt-20 grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-8 lg:grid-cols-4 lg:gap-x-10">
          {authors.map((author, i) => (
            <li key={author.slug}>
              <Reveal delay={i * 0.05} y={20}>
                <Link
                  href={`/authors/${author.slug}`}
                  className="plate flex items-center justify-center"
                  data-ring="Read"
                  aria-label={`${author.name} — ${author.genre}`}
                >
                  <span className="plate-monogram" aria-hidden="true">
                    {author.initials}
                  </span>

                  <span className="plate-reveal text-paper absolute inset-0 flex flex-col justify-end p-5 sm:p-6">
                    <span className="t-quote text-[1.0625rem] leading-[1.4]">
                      {author.blurb}
                    </span>
                    <span className="text-paper/55 mt-3 text-[0.8125rem]">
                      {author.publications} books, {author.based}
                    </span>
                  </span>
                </Link>

                <h3 className="t-display-s mt-5">{author.name}</h3>
                <p className="t-micro mt-1.5">{author.genre}</p>
              </Reveal>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
