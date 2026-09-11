import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import PublishTimeline from "@/components/PublishTimeline";
import SubmitForm from "@/components/SubmitForm";
import JsonLd from "@/components/JsonLd";
import { MaskedLines, Reveal } from "@/components/Motion";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "How to publish with ScriptLyra: what we read, what we pay, the five stages of making a book, and where to send your manuscript.";

export const metadata: Metadata = {
  title: "Publish with us",
  description,
  alternates: { canonical: "/publish" },
  openGraph: { title: `Publish with us — ${site.wordmark}`, description, url: "/publish" },
  twitter: { title: `Publish with us — ${site.wordmark}`, description },
};

const readingFor = [
  "Novels and novellas, finished or nearly finished, from twenty thousand words up.",
  "Poetry collections with a shape to them — a sequence, an argument, a year.",
  "Essays and criticism, single-author collections rather than one piece.",
  "Short stories, if the collection holds together as a book.",
];

const notFor = [
  "Anything sent to twelve houses at once. We read slowly and would rather not waste your time or ours.",
  "Manuscripts we are asked to pay for placement in, or that arrive with a fee attached. We never charge writers.",
  "Work that needs a series to make sense. One book at a time.",
];

const terms = [
  {
    term: "Advances",
    detail:
      "Modest and real: between two and eight thousand, paid half on signature and half on delivery. We would rather commit to fewer books properly.",
  },
  {
    term: "Royalties",
    detail:
      "Ten per cent of the cover price on print, twenty-five on digital, paid twice a year with a statement you can actually read.",
  },
  {
    term: "Rights",
    detail:
      "You keep translation, audio and screen rights unless you ask us to handle them. Nothing is bundled in by default.",
  },
  {
    term: "Costs",
    detail:
      "Editing, design, typesetting, printing and publicity are ours. You are never asked to contribute to production.",
  },
];

export default function PublishPage() {
  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Publish with us", path: "/publish" },
          ]),
        ]}
      />

      <PageHeader
        head="Publishing with us"
        meta="Open for submissions"
        lines={["Turn your manuscript", "into something real."]}
        lead="We take on four to six books a year. Every one of them arrived as a document from someone who was not sure it was ready."
      />

      <section className="shell pb-24 sm:pb-32" aria-labelledby="what-we-read">
        <div className="grid gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <h2 id="what-we-read" className="t-display-m">
              What we read
            </h2>

            <ul className="mt-8">
              {readingFor.map((line) => (
                <li key={line.slice(0, 20)} className="border-rule border-t py-5 first:border-t-0">
                  <p className="t-body">{line}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="lg:col-span-5 lg:col-start-8">
            <h2 className="t-display-m">What we do not</h2>

            <ul className="mt-8">
              {notFor.map((line) => (
                <li key={line.slice(0, 20)} className="border-rule border-t py-5 first:border-t-0">
                  <p className="t-body text-graphite">{line}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <PublishTimeline
        sectionId="how"
        titleId="how-title"
        folio={null}
        lines={["Five stages,", "nine months."]}
        lead="Between the document you send and the book on a shelf. Nothing here is a surprise, and nothing here is skipped."
        cta={false}
      />

      <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="terms">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 id="terms" className="t-display-m">
            The terms, in advance
          </h2>

          <dl className="mt-12 grid gap-x-16 gap-y-10 sm:grid-cols-2">
            {terms.map((item) => (
              <div key={item.term} className="border-rule border-t pt-6">
                <dt className="t-display-s">{item.term}</dt>
                <dd className="t-body text-graphite mt-3">{item.detail}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section
        id="submit"
        className="grain-paper bg-leaf relative scroll-mt-20"
        data-nav-tone="ink"
        aria-labelledby="submit-title"
      >
        <div className="above-grain shell py-24 sm:py-32">
          <hr className="crease mb-14" />

          <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <h2 id="submit-title" className="t-display-l max-w-[14ch]">
                <MaskedLines lines={["Send it", "to us."]} onScroll />
              </h2>

              <p className="t-body text-graphite mt-8">
                The first fifty pages, a short description in your own words, and a way to reach
                you. No synopsis template, no comparison titles, no pitch deck.
              </p>

              <p className="t-micro mt-8">
                Submissions are read in the order they arrive. Eight weeks, an answer either way.
              </p>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <Reveal y={20}>
                <SubmitForm />
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      <section className="on-ink grain-ink bg-ink text-paper relative" data-nav-tone="paper">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 className="t-display-l max-w-[20ch]">
            <MaskedLines lines={["Every book on our list", "arrived unannounced."]} onScroll />
          </h2>

          <p className="t-body-serif text-paper/70 mt-10">
            Four of the six were open submissions from writers nobody had published. That is not
            a policy we are proud of having. It is just how the good ones tend to arrive.
          </p>

          <p className="mt-10">
            <Link href="/books" className="link-rule text-paper text-[0.9375rem]">
              See what came of them
            </Link>
          </p>
        </div>
      </section>
    </>
  );
}
