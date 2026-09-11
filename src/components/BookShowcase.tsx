import Link from "next/link";
import BookCover from "./BookCover";
import SectionHeading from "./SectionHeading";
import { MaskedLines, Reveal } from "./Motion";
import { featuredBooks } from "@/lib/books";
import { folios } from "@/lib/site";

const grounds = {
  ink: "on-ink grain-ink bg-ink text-paper",
  paper: "grain-paper bg-paper text-ink",
  leaf: "grain-paper bg-leaf text-ink",
} as const;

/**
 * The list, shown one book at a time. Each title is a full screen that slides
 * over the one before it, so the ground changes under you as you read down the
 * catalogue — the sequence is real, and so are the numbers.
 *
 * The stacking is plain CSS sticky positioning: no scroll maths, nothing to
 * fall out of sync. On small screens the panels simply follow one another.
 */
export default function BookShowcase() {
  return (
    <section aria-labelledby="books-title">
      <div className="grain-paper relative" data-nav-tone="ink">
        <div className="above-grain shell pb-20 sm:pb-28">
          <hr className="crease mb-14" />
          <SectionHeading
            folio={folios.books}
            id="books-title"
            lines={["Four books,", "chosen slowly."]}
            lead="We publish a handful of titles a year and stand behind every one. Here are the four we cannot stop talking about."
            link={{ label: "The whole list", href: "/books" }}
          />
        </div>
      </div>

      <div>
        {featuredBooks.map((book) => {
          const onInk = book.ground === "ink";

          return (
            <article
              key={book.slug}
              data-nav-tone={onInk ? "paper" : "ink"}
              className={`relative overflow-hidden md:sticky md:top-0 md:h-svh ${grounds[book.ground]}`}
            >
              <div className="above-grain shell flex min-h-svh flex-col justify-center py-24 md:h-full md:min-h-0 md:py-0">
                <div className="grid items-center gap-12 md:grid-cols-12 md:gap-10 lg:gap-14">
                  <Reveal className="md:col-span-5" y={28} duration={1.1}>
                    <Link
                      href={`/books/${book.slug}`}
                      data-ring="Open"
                      aria-label={`${book.title} by ${book.author}`}
                      className="block"
                    >
                      <BookCover
                        book={book}
                        lifted
                        className="mx-auto w-[64%] min-w-[10rem] md:w-full md:max-w-[22rem]"
                      />
                    </Link>
                  </Reveal>

                  <div className="md:col-span-6 md:col-start-7">
                    <div className="flex items-baseline gap-5">
                      <span className="t-numeral text-[2.125rem] leading-none">{book.index}</span>
                      <span className={`h-px flex-1 ${onInk ? "bg-white/25" : "bg-rule"}`} />
                      <span className={`t-micro ${onInk ? "text-paper/55" : ""}`}>
                        {book.genre}
                      </span>
                    </div>

                    <h3 className="t-display-l mt-8 max-w-[18ch]">
                      <MaskedLines lines={[book.title]} onScroll />
                    </h3>

                    <p
                      className={`t-quote mt-7 max-w-[30ch] text-[clamp(1.125rem,1.9vw,1.625rem)] leading-[1.35] ${
                        onInk ? "text-paper/80" : "text-graphite"
                      }`}
                    >
                      {book.line}
                    </p>

                    <dl
                      className={`mt-12 grid max-w-lg grid-cols-3 gap-6 border-t pt-6 ${
                        onInk ? "border-white/15" : "border-rule"
                      }`}
                    >
                      <div>
                        <dt className={`t-micro ${onInk ? "text-paper/55" : ""}`}>Written by</dt>
                        <dd className="mt-2 text-[0.9375rem]">{book.author}</dd>
                      </div>
                      <div>
                        <dt className={`t-micro ${onInk ? "text-paper/55" : ""}`}>Published</dt>
                        <dd className="t-numeral mt-2 text-[0.9375rem]">{book.year}</dd>
                      </div>
                      <div>
                        <dt className={`t-micro ${onInk ? "text-paper/55" : ""}`}>Extent</dt>
                        <dd className="t-numeral mt-2 text-[0.9375rem]">{book.pages} pages</dd>
                      </div>
                    </dl>

                    <Link
                      href={`/books/${book.slug}`}
                      className="link-rule mt-10 inline-block text-[0.9375rem]"
                    >
                      Open the book
                    </Link>
                  </div>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
