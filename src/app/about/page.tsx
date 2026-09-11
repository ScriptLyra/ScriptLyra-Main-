import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { MaskedLines, Reveal } from "@/components/Motion";
import { breadcrumbSchema } from "@/lib/schema";
import { books } from "@/lib/books";
import { site } from "@/lib/site";

const description =
  "ScriptLyra is a small publishing house: four to six books a year, edited slowly, kept in print, and paid for on time.";

export const metadata: Metadata = {
  title: "About",
  description,
  alternates: { canonical: "/about" },
  openGraph: { title: `About — ${site.wordmark}`, description, url: "/about" },
  twitter: { title: `About — ${site.wordmark}`, description },
};

const history = [
  "ScriptLyra started in 2019 in the back room of a bookshop, with one manuscript nobody else would take and an argument about how it should be set. The manuscript became our first book. The argument became the house style.",
  "We publish four to six titles a year. That number is not modesty — it is the most any of us can edit properly while also answering letters, reading submissions and getting the paper stock right.",
  "Everything we publish stays in print. If a book sells eleven copies in a year we reprint eleven copies, because the alternative is telling a writer their book is over.",
];

const principles = [
  {
    name: "We edit slowly",
    detail:
      "Two full passes with the same editor, structure before sentences. Nothing goes to press because a catalogue deadline says it must.",
  },
  {
    name: "We keep books in print",
    detail:
      "Short runs, reprinted as needed, for as long as anyone is still reading. No remainder bins, no quiet deletions.",
  },
  {
    name: "We pay on time",
    detail:
      "Royalties twice a year to the day, with a statement in plain language. Writers should not have to chase a small press for money.",
  },
];

const facts = [
  { term: "Founded", detail: "2019, Edinburgh" },
  { term: "Titles in print", detail: `${books.length}` },
  { term: "Writers on the list", detail: "21" },
  { term: "People in the office", detail: "Nine, two of them part-time" },
  { term: "Reading period", detail: "Open, all year" },
  { term: "Books a year", detail: "Four to six" },
];

export default function AboutPage() {
  return (
    <>
      <JsonLd
        nodes={[
          {
            "@type": "AboutPage",
            "@id": `${site.url}/about#page`,
            url: `${site.url}/about`,
            name: `About — ${site.wordmark}`,
            description,
            about: { "@id": `${site.url}/#organization` },
          },
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "About", path: "/about" },
          ]),
        ]}
      />

      <PageHeader
        head="The house"
        meta="Since 2019"
        lines={["A small house", "with a long memory."]}
        lead="Nine people, one bookshop staircase, and a list we can defend book by book."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="How the house started">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="space-y-7 lg:col-span-7">
            {history.map((paragraph) => (
              <p key={paragraph.slice(0, 24)} className="t-body-serif">
                {paragraph}
              </p>
            ))}
          </div>

          <dl className="lg:col-span-4 lg:col-start-9">
            {facts.map((fact) => (
              <div key={fact.term} className="border-rule flex items-baseline justify-between gap-6 border-b py-4">
                <dt className="t-micro">{fact.term}</dt>
                <dd className="t-numeral text-[0.9375rem]">{fact.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grain-paper bg-leaf relative" data-nav-tone="ink" aria-labelledby="how-we-work">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 id="how-we-work" className="t-display-l max-w-[18ch]">
            <MaskedLines lines={["Three things we", "will not trade away."]} onScroll />
          </h2>

          <dl className="mt-16">
            {principles.map((principle, i) => (
              <div key={principle.name} className="border-rule border-t first:border-t-0">
                <Reveal delay={i * 0.06} y={18}>
                  <div className="grid gap-x-10 gap-y-3 py-9 lg:grid-cols-12">
                    <dt className="t-display-m lg:col-span-5">{principle.name}</dt>
                    <dd className="t-body lg:col-span-6 lg:col-start-7">{principle.detail}</dd>
                  </div>
                </Reveal>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="colophon">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 id="colophon" className="t-display-m">
            Colophon
          </h2>

          <div className="mt-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <p className="t-body-serif lg:col-span-6">
              Our books are set in Instrument Serif and printed on 80gsm Munken Print Cream,
              sewn in sixteen-page sections by a bindery in Fife that has been doing it since
              1904. Two titles a year are set in metal, which is slower and more expensive and
              produces a page you can feel with your thumb.
            </p>

            <p className="t-body text-graphite lg:col-span-5 lg:col-start-8">
              This website is set in the same two faces as the books, on paper the same colour
              as the endpapers. There are no photographs of authors on it, because a monogram
              struck into a flyleaf tells you more about a house than a headshot does.
            </p>
          </div>
        </div>
      </section>

      <section className="grain-paper bg-leaf relative" data-nav-tone="ink" aria-labelledby="legal">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 id="legal" className="t-display-m">
            The small print, in plain words
          </h2>

          <div className="mt-12 grid gap-x-16 gap-y-12 lg:grid-cols-3">
            <article id="privacy" className="border-rule scroll-mt-24 border-t pt-6">
              <h3 className="t-display-s">Privacy</h3>
              <p className="t-body text-graphite mt-4">
                We keep your email address if you ask for the Journal, and your manuscript if you
                send one. Nothing is sold, nothing is shared, and there are no third-party
                trackers on this site. Ask us to delete your details and we will, that week.
              </p>
            </article>

            <article id="terms" className="border-rule scroll-mt-24 border-t pt-6">
              <h3 className="t-display-s">Terms</h3>
              <p className="t-body text-graphite mt-4">
                Reading this site costs nothing and commits you to nothing. Sending us a
                manuscript does not create a contract; a contract is a document we both sign,
                written in language you can read without help.
              </p>
            </article>

            <article id="copyright" className="border-rule scroll-mt-24 border-t pt-6">
              <h3 className="t-display-s">Copyright</h3>
              <p className="t-body text-graphite mt-4">
                Our authors own their work. Extracts on this site appear with their permission.
                Quote up to four hundred words in a review without asking; for anything longer,{" "}
                <Link href="/contact" className="link-rule text-ink">
                  write to the rights desk
                </Link>
                .
              </p>
            </article>
          </div>
        </div>
      </section>

      <section className="on-ink grain-ink bg-ink text-paper relative" data-nav-tone="paper">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 className="t-display-l max-w-[20ch]">
            <MaskedLines lines={["The door is on", "Cathedral Row."]} onScroll />
          </h2>

          <p className="t-body-serif text-paper/70 mt-10">
            Second floor, above a bookshop, no reception. Write first and there will be coffee and
            probably an argument about commas.
          </p>

          <p className="mt-10">
            <Link href="/contact" className="link-rule text-paper text-[0.9375rem]">
              Come and find us
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
