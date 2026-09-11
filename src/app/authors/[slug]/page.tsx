import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import BookCard from "@/components/BookCard";
import JsonLd from "@/components/JsonLd";
import { MaskedLines, Reveal } from "@/components/Motion";
import { authorBySlug, authors } from "@/lib/authors";
import { booksByAuthor } from "@/lib/books";
import { breadcrumbSchema, personSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Params = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return authors.map((author) => ({ slug: author.slug }));
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { slug } = await params;
  const author = authorBySlug(slug);

  if (!author) return { title: "Author not found" };

  const description = `${author.blurb} ${author.name} has published ${author.publications} books, ${booksByAuthor(author.slug).length} of them with ScriptLyra.`;

  return {
    title: author.name,
    description,
    alternates: { canonical: `/authors/${author.slug}` },
    openGraph: {
      type: "profile",
      title: `${author.name} — ${site.wordmark}`,
      description,
      url: `/authors/${author.slug}`,
    },
    twitter: { title: `${author.name} — ${site.wordmark}`, description },
  };
}

export default async function AuthorPage({ params }: Params) {
  const { slug } = await params;
  const author = authorBySlug(slug);

  if (!author) notFound();

  const titles = booksByAuthor(author.slug);
  const firstName = author.name.split(" ")[0];

  return (
    <>
      <JsonLd
        nodes={[
          personSchema(author),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Authors", path: "/authors" },
            { name: author.name, path: `/authors/${author.slug}` },
          ]),
        ]}
      />

      <section className="grain-paper relative" data-nav-tone="ink">
        <div className="above-grain shell pt-[calc(var(--nav-h)+3rem)] pb-20 sm:pt-[calc(var(--nav-h)+5rem)] sm:pb-28">
          <nav aria-label="Breadcrumb" className="t-micro">
            <Link href="/authors" className="link-rule">
              Back to the authors
            </Link>
          </nav>

          <div className="mt-12 grid gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-4">
              <Reveal y={24}>
                <div
                  className="plate mx-auto flex max-w-[17rem] items-center justify-center lg:mx-0 lg:max-w-none"
                  data-ring="Read"
                >
                  <span className="plate-monogram" aria-hidden="true">
                    {author.initials}
                  </span>
                  <span className="plate-reveal text-paper absolute inset-0 flex items-end p-6">
                    <span className="t-quote text-[1.0625rem] leading-[1.4]">{author.blurb}</span>
                  </span>
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              <p className="t-folio italic">{author.genre}</p>

              <h1 className="t-display-l mt-6 max-w-[16ch]">
                <MaskedLines lines={[author.name]} delay={0.08} />
              </h1>

              <p className="t-quote text-graphite mt-6 text-[clamp(1.25rem,2vw,1.75rem)]">
                {author.blurb}
              </p>

              <hr className="crease mt-10" />

              <div className="mt-10 space-y-6">
                {author.bio.map((paragraph) => (
                  <p key={paragraph.slice(0, 24)} className="t-body-serif">
                    {paragraph}
                  </p>
                ))}
              </div>

              <dl className="border-rule mt-14 grid grid-cols-2 gap-y-7 border-t pt-8 sm:grid-cols-4">
                <div>
                  <dt className="t-micro">Writes</dt>
                  <dd className="mt-1.5 text-[0.9375rem]">{author.genre}</dd>
                </div>
                <div>
                  <dt className="t-micro">Based in</dt>
                  <dd className="mt-1.5 text-[0.9375rem]">{author.based}</dd>
                </div>
                <div>
                  <dt className="t-micro">With us since</dt>
                  <dd className="t-numeral mt-1.5 text-[0.9375rem]">{author.since}</dd>
                </div>
                <div>
                  <dt className="t-micro">Books published</dt>
                  <dd className="t-numeral mt-1.5 text-[0.9375rem]">{author.publications}</dd>
                </div>
              </dl>

              {author.links.length ? (
                <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  {author.links.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} className="link-rule text-[0.9375rem]">
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      {titles.length ? (
        <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="with-us">
          <div className="above-grain shell pb-24 sm:pb-32">
            <hr className="crease" />

            <h2 id="with-us" className="t-display-m mt-14">
              {titles.length === 1 ? "The book we published" : "Books we have published"}
            </h2>

            <ul className="mt-12 grid grid-cols-2 gap-x-6 gap-y-14 sm:gap-x-9 lg:grid-cols-3 lg:gap-x-14">
              {titles.map((book, i) => (
                <li key={book.slug}>
                  <Reveal delay={i * 0.06} y={20}>
                    <BookCard book={book} />
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}

      <section className="on-ink grain-ink bg-ink text-paper relative" data-nav-tone="paper">
        <div className="above-grain shell py-24 sm:py-32">
          <div className="grid gap-10 lg:grid-cols-12 lg:gap-16">
            <h2 className="t-display-m max-w-[16ch] lg:col-span-5">Write to {firstName}.</h2>

            <div className="lg:col-span-6 lg:col-start-7">
              <p className="t-body-serif text-paper/75">
                Reader letters go to the house, unopened, and we pass them on. It is slower than
                a message form and it works better: {firstName} answers letters.
              </p>
              <p className="mt-8">
                <Link href="/contact" className="link-rule text-paper text-[0.9375rem]">
                  The house address
                </Link>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
