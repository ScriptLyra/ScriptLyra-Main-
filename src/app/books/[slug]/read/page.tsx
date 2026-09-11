import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import JsonLd from "@/components/JsonLd";
import ReadingProgress from "@/components/ReadingProgress";
import { bookBySlug, books } from "@/lib/books";
import { breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = bookBySlug(slug);

  if (!book) return { title: "Extract not found" };

  const title = `${book.title} — an extract`;
  const description = `Read the opening pages of ${book.title} by ${book.author}.`;

  return {
    title,
    description,
    alternates: { canonical: `/books/${book.slug}/read` },
    openGraph: {
      type: "article",
      title: `${title} — ${site.wordmark}`,
      description,
      url: `/books/${book.slug}/read`,
    },
    twitter: { title: `${title} — ${site.wordmark}`, description },
  };
}

export default async function ReadPage({ params }: Params) {
  const { slug } = await params;
  const book = bookBySlug(slug);

  if (!book) notFound();

  /** Verse keeps its own line breaks and refuses a drop cap. */
  const verse = book.excerpt.some((passage) => passage.includes("\n"));

  return (
    <>
      <JsonLd
        nodes={[
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Books", path: "/books" },
            { name: book.title, path: `/books/${book.slug}` },
            { name: "Extract", path: `/books/${book.slug}/read` },
          ]),
        ]}
      />

      <ReadingProgress />

      <article className="grain-paper relative" data-nav-tone="ink">
        <div className="above-grain shell pt-[calc(var(--nav-h)+3rem)] pb-24 sm:pb-32">
          <div className="mx-auto max-w-[42rem]">
            <p className="t-micro flex items-baseline justify-between gap-6">
              <span>
                An extract from{" "}
                <Link href={`/books/${book.slug}`} className="link-rule text-ink">
                  {book.title}
                </Link>
              </span>
              <span>{book.contents[0]?.title}</span>
            </p>

            <hr className="crease mt-5" />

            <h1 className="t-display-m mt-12">{book.title}</h1>
            <p className="t-micro mt-3">
              <Link href={`/authors/${book.authorSlug}`} className="link-rule">
                {book.author}
              </Link>
            </p>

            {/* The reading column: one measure, wide leading, nothing in the
                margins to look at. */}
            <div className="mt-14 space-y-8">
              {book.excerpt.map((passage, i) => (
                <p
                  key={passage.slice(0, 24)}
                  className={`t-body-serif whitespace-pre-line ${
                    i === 0 && !verse
                      ? "first-letter:font-display first-letter:mt-[0.06em] first-letter:mr-[0.08em] first-letter:float-left first-letter:text-[4.6rem] first-letter:leading-[0.72]"
                      : ""
                  }`}
                >
                  {passage}
                </p>
              ))}
            </div>

            <hr className="crease mt-16" />

            <div className="mt-12">
              <p className="t-quote text-graphite text-[1.375rem]">The extract ends here.</p>
              <p className="t-body text-graphite mt-4">
                {book.title} runs to {book.pages} pages and is available from bookshops, or
                directly from us.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-7">
                <Button href={`/books/${book.slug}`} variant="ink">
                  Back to the book
                </Button>
                <Link href="/books" className="link-rule text-[0.9375rem]">
                  The whole list
                </Link>
              </div>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
