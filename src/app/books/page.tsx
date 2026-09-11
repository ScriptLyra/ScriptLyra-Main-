import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import BookCard from "@/components/BookCard";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { books } from "@/lib/books";
import { breadcrumbSchema, listSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "Every title ScriptLyra has published, in catalogue order: literary fiction, poetry, essays and short stories.";

export const metadata: Metadata = {
  title: "Books",
  description,
  alternates: { canonical: "/books" },
  openGraph: {
    title: `Books — ${site.wordmark}`,
    description,
    url: "/books",
  },
  twitter: { title: `Books — ${site.wordmark}`, description },
};

export default function BooksPage() {
  return (
    <>
      <JsonLd
        nodes={[
          listSchema(
            "The ScriptLyra list",
            "/books",
            books.map((book) => ({ name: book.title, url: `${site.url}/books/${book.slug}` })),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Books", path: "/books" },
          ]),
        ]}
      />

      <PageHeader
        head="The list"
        meta={`${books.length} titles in print`}
        lines={["Everything we have", "put our name to."]}
        lead="We publish four to six books a year. Each one is edited slowly, set by hand, and kept in print for as long as anyone is still reading it."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Catalogue">
        <ul className="grid grid-cols-2 gap-x-6 gap-y-16 sm:gap-x-9 lg:grid-cols-3 lg:gap-x-14 lg:gap-y-24">
          {books.map((book, i) => (
            <li key={book.slug}>
              <Reveal delay={(i % 3) * 0.06} y={22}>
                <BookCard book={book} />
              </Reveal>
            </li>
          ))}
        </ul>
      </section>

      <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="full-list">
        <div className="above-grain shell pb-24 sm:pb-32">
          <hr className="crease" />

          <h2 id="full-list" className="t-display-m mt-14">
            The list, in full
          </h2>

          <div className="mt-10 overflow-x-auto">
            <table className="w-full min-w-[34rem] border-collapse text-left">
              <caption className="sr-only">
                Every ScriptLyra title with its catalogue number, author, subject, extent and
                ISBN.
              </caption>
              <thead>
                <tr className="border-rule border-b">
                  <th scope="col" className="t-micro w-14 pb-4 font-normal">
                    No.
                  </th>
                  <th scope="col" className="t-micro pb-4 font-normal">
                    Title
                  </th>
                  <th scope="col" className="t-micro pb-4 font-normal">
                    Author
                  </th>
                  <th scope="col" className="t-micro hidden pb-4 font-normal sm:table-cell">
                    Subject
                  </th>
                  <th scope="col" className="t-micro hidden pb-4 text-right font-normal md:table-cell">
                    Extent
                  </th>
                  <th scope="col" className="t-micro hidden pb-4 text-right font-normal lg:table-cell">
                    ISBN
                  </th>
                </tr>
              </thead>
              <tbody>
                {books.map((book) => (
                  <tr key={book.slug} className="border-rule border-b align-baseline">
                    <td className="t-numeral text-graphite py-5 text-sm">{book.index}</td>
                    <td className="py-5 pr-6">
                      <Link href={`/books/${book.slug}`} className="link-rule text-[1.0625rem]">
                        {book.title}
                      </Link>
                    </td>
                    <td className="py-5 pr-6">
                      <Link
                        href={`/authors/${book.authorSlug}`}
                        className="link-rule text-graphite text-[0.9375rem]"
                      >
                        {book.author}
                      </Link>
                    </td>
                    <td className="t-micro hidden py-5 pr-6 sm:table-cell">{book.genre}</td>
                    <td className="t-micro t-numeral hidden py-5 text-right md:table-cell">
                      {book.pages} pp
                    </td>
                    <td className="t-micro t-numeral hidden py-5 text-right lg:table-cell">
                      {book.isbn}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-20 grid gap-12 sm:grid-cols-2 lg:gap-20">
            <div>
              <h3 className="t-display-s">Where to buy</h3>
              <p className="t-body text-graphite mt-4">
                Every title is stocked by independent bookshops in the UK, Ireland and Nigeria,
                and can be ordered through them. We would rather you bought a book from someone
                who has read it.
              </p>
            </div>
            <div>
              <h3 className="t-display-s">Rights and permissions</h3>
              <p className="t-body text-graphite mt-4">
                Translation, audio and serial rights are handled in house. For extracts over
                four hundred words, or anything involving a reading,{" "}
                <Link href="/contact" className="link-rule text-ink">
                  write to us
                </Link>
                .
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
