import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookCover from "@/components/BookCover";
import BookCard from "@/components/BookCard";
import Button from "@/components/Button";
import JsonLd from "@/components/JsonLd";
import { MaskedLines, Reveal } from "@/components/Motion";
import { authorBySlug } from "@/lib/authors";
import { bookBySlug, books } from "@/lib/books";
import { bookSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return books.map((book) => ({ slug: book.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const book = bookBySlug(slug);

  if (!book) return { title: "Book not found" };

  const title = `${book.title} by ${book.author}`;
  const description = `${book.line} ${book.description[0]}`;

  return {
    title,
    description,
    alternates: { canonical: `/books/${book.slug}` },
    openGraph: {
      type: "article",
      title: `${title} — ${site.wordmark}`,
      description,
      url: `/books/${book.slug}`,
      publishedTime: book.published,
    },
    twitter: { title: `${title} — ${site.wordmark}`, description },
  };
}

function pretty(date: string) {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BookPage({ params }: Params) {
  const { slug } = await params;
  const book = bookBySlug(slug);

  if (!book) notFound();

  const author = authorBySlug(book.authorSlug);
  const alsoOnList = books.filter((other) => other.slug !== book.slug).slice(0, 3);

  return (
    <>
      <JsonLd
        nodes={[
          bookSchema(book),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Books", path: "/books" },
            { name: book.title, path: `/books/${book.slug}` },
          ]),
        ]}
      />

      {/* The title page: cover on the left, everything a reader decides on to
          the right of it. */}
      <section className="grain-paper relative" data-nav-tone="ink">
        <div className="above-grain shell pt-[calc(var(--nav-h)+3rem)] pb-20 sm:pt-[calc(var(--nav-h)+5rem)] sm:pb-28">
          <nav aria-label="Breadcrumb" className="t-micro">
            <Link href="/books" className="link-rule">
              Back to the list
            </Link>
          </nav>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <Reveal y={26}>
                <div className="mx-auto max-w-[19rem] sm:max-w-[22rem] lg:sticky lg:top-[calc(var(--nav-h)+2.5rem)] lg:mx-0 lg:max-w-none">
                  <BookCover book={book} lifted />
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="t-folio flex items-baseline gap-3">
                <span className="t-numeral">{book.index}</span>
                <span className="italic">{book.genre}</span>
              </p>

              <h1 className="t-display-l mt-6 max-w-[18ch]">
                <MaskedLines lines={[book.title]} delay={0.08} />
              </h1>

              <p className="t-quote text-graphite mt-6 text-[clamp(1.25rem,2vw,1.75rem)]">
                {book.line}
              </p>

              <p className="t-micro mt-8">
                Written by{" "}
                <Link href={`/authors/${book.authorSlug}`} className="link-rule text-ink">
                  {book.author}
                </Link>
              </p>

              <hr className="crease mt-10" />

              <div className="mt-10 space-y-6">
                {book.description.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="t-body-serif">
                    {paragraph}
                  </p>
                ))}
              </div>

              <div className="mt-12 flex flex-wrap items-center gap-7">
                <Button href={`/books/${book.slug}/read`} variant="ink">
                  Read an extract
                </Button>
                <Link href={`/authors/${book.authorSlug}`} className="link-rule text-[0.9375rem]">
                  More by {book.author.split(" ")[0]}
                </Link>
              </div>

              <dl className="border-rule mt-16 grid grid-cols-2 gap-y-7 border-t pt-8 sm:grid-cols-4">
                <div>
                  <dt className="t-micro">Published</dt>
                  <dd className="t-numeral mt-1.5 text-[0.9375rem]">{pretty(book.published)}</dd>
                </div>
                <div>
                  <dt className="t-micro">Extent</dt>
                  <dd className="t-numeral mt-1.5 text-[0.9375rem]">{book.pages} pages</dd>
                </div>
                <div>
                  <dt className="t-micro">Format</dt>
                  <dd className="mt-1.5 text-[0.9375rem]">Paperback, sewn</dd>
                </div>
                <div>
                  <dt className="t-micro">ISBN</dt>
                  <dd className="t-numeral mt-1.5 text-[0.9375rem]">{book.isbn}</dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </section>

      {/* Contents and notices sit side by side, the way a book puts its
          contents on the recto and its praise on the jacket. */}
      <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="contents">
        <div className="above-grain shell pb-24 sm:pb-32">
          <hr className="crease" />

          <div className="mt-14 grid gap-14 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-5">
              <h2 id="contents" className="t-display-m">
                Contents
              </h2>

              <ol className="mt-8">
                {book.contents.map((entry) => (
                  <li
                    key={entry.n}
                    className="border-rule flex items-baseline gap-6 border-b py-4 last:border-b-0"
                  >
                    <span className="t-folio w-6 shrink-0">{entry.n}</span>
                    <span className="t-body-serif">{entry.title}</span>
                  </li>
                ))}
              </ol>
            </div>

            {book.reviews.length ? (
              <div className="lg:col-span-6 lg:col-start-7">
                <h2 className="t-display-m">Notices</h2>

                <ul className="mt-8 space-y-12">
                  {book.reviews.map((review) => (
                    <li key={review.source}>
                      <Reveal y={18}>
                        <blockquote className="t-quote text-[clamp(1.375rem,2.4vw,2rem)] leading-[1.28]">
                          {review.quote}
                        </blockquote>
                        <p className="t-micro mt-5">{review.source}</p>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      {author ? (
        <section className="grain-paper bg-leaf relative" data-nav-tone="ink">
          <div className="above-grain shell py-20 sm:py-24">
            <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
              <Link
                href={`/authors/${author.slug}`}
                className="plate flex w-[9rem] items-center justify-center lg:col-span-2 lg:w-full"
                data-ring="Read"
                aria-label={`${author.name} — ${author.genre}`}
              >
                <span className="plate-monogram text-[3.5rem] lg:text-[clamp(2.5rem,4vw,4rem)]" aria-hidden="true">
                  {author.initials}
                </span>
              </Link>

              <div className="lg:col-span-8 lg:col-start-4">
                <h2 className="t-display-s">
                  <Link href={`/authors/${author.slug}`} className="link-rule">
                    About {author.name}
                  </Link>
                </h2>
                <p className="t-body text-graphite mt-4">{author.bio[0]}</p>
              </div>
            </div>
          </div>
        </section>
      ) : null}

      <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="also">
        <div className="above-grain shell py-24 sm:py-32">
          <h2 id="also" className="t-display-m">
            Also on the list
          </h2>

          <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-9 lg:grid-cols-3 lg:gap-x-14">
            {alsoOnList.map((other, i) => (
              <li key={other.slug}>
                <Reveal delay={i * 0.06} y={20}>
                  <BookCard book={other} />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="on-ink grain-ink bg-ink text-paper relative" data-nav-tone="paper">
        <div className="above-grain shell py-24 text-center sm:py-32">
          <blockquote className="t-quote mx-auto max-w-[24ch] text-[clamp(2rem,5vw,4rem)] leading-[1.06]">
            {book.line}
          </blockquote>

          <div className="mt-14 flex flex-wrap items-center justify-center gap-7">
            <Button href={`/books/${book.slug}/read`} variant="paper">
              Read an extract
            </Button>
            <Link href="/books" className="link-rule text-paper/70 text-[0.9375rem]">
              The whole list
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
