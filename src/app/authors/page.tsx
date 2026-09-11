import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { authors } from "@/lib/authors";
import { booksByAuthor } from "@/lib/books";
import { breadcrumbSchema, listSchema, personSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "The writers published by ScriptLyra: novelists, poets and essayists, and the books they made with us.";

export const metadata: Metadata = {
  title: "Authors",
  description,
  alternates: { canonical: "/authors" },
  openGraph: { title: `Authors — ${site.wordmark}`, description, url: "/authors" },
  twitter: { title: `Authors — ${site.wordmark}`, description },
};

export default function AuthorsPage() {
  return (
    <>
      <JsonLd
        nodes={[
          listSchema(
            "ScriptLyra authors",
            "/authors",
            authors.map((author) => ({
              name: author.name,
              url: `${site.url}/authors/${author.slug}`,
            })),
          ),
          ...authors.map(personSchema),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Authors", path: "/authors" },
          ]),
        ]}
      />

      <PageHeader
        head="Voices"
        meta="Four of twenty-one"
        lines={["The people who", "wrote them."]}
        lead="Some of our writers came in through an open submission. Some we asked. All of them are still on the list."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Authors">
        {authors.map((author, i) => {
          const titles = booksByAuthor(author.slug);

          return (
            <article key={author.slug} className="border-rule border-t py-14 first:border-t-0 first:pt-0 sm:py-20">
              <Reveal y={20} delay={i === 0 ? 0 : 0.04}>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
                  <Link
                    href={`/authors/${author.slug}`}
                    className="plate flex max-w-[16rem] items-center justify-center lg:col-span-3 lg:max-w-none"
                    data-ring="Read"
                    aria-label={`${author.name} — ${author.genre}`}
                  >
                    <span className="plate-monogram" aria-hidden="true">
                      {author.initials}
                    </span>
                    <span className="plate-reveal text-paper absolute inset-0 flex items-end p-5">
                      <span className="t-quote text-[1.0625rem] leading-[1.4]">{author.blurb}</span>
                    </span>
                  </Link>

                  <div className="lg:col-span-8 lg:col-start-5">
                    <h2 className="t-display-m">
                      <Link href={`/authors/${author.slug}`} className="link-rule">
                        {author.name}
                      </Link>
                    </h2>

                    <dl className="border-rule mt-7 grid grid-cols-2 gap-y-5 border-t pt-5 sm:grid-cols-3">
                      <div>
                        <dt className="t-micro">Writes</dt>
                        <dd className="mt-1 text-[0.9375rem]">{author.genre}</dd>
                      </div>
                      <div>
                        <dt className="t-micro">Based in</dt>
                        <dd className="mt-1 text-[0.9375rem]">{author.based}</dd>
                      </div>
                      <div>
                        <dt className="t-micro">With us since</dt>
                        <dd className="t-numeral mt-1 text-[0.9375rem]">{author.since}</dd>
                      </div>
                    </dl>

                    <p className="t-body text-graphite mt-8">{author.bio[0]}</p>

                    {titles.length ? (
                      <p className="t-micro mt-8">
                        On our list:{" "}
                        {titles.map((book, index) => (
                          <span key={book.slug}>
                            {index > 0 ? ", " : ""}
                            <Link href={`/books/${book.slug}`} className="link-rule text-ink">
                              {book.title}
                            </Link>
                          </span>
                        ))}
                      </p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            </article>
          );
        })}
      </section>
    </>
  );
}
