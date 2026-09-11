import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { listWriters } from "@/lib/profiles";
import { initials } from "@/lib/initials";
import { breadcrumbSchema, listSchema, writerSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "The writers publishing on ScriptLyra — the people posting to the blog, and what they write about.";

export const metadata: Metadata = {
  title: "Writers",
  description,
  alternates: { canonical: "/writers" },
  openGraph: { title: `Writers — ${site.wordmark}`, description, url: "/writers" },
  twitter: { title: `Writers — ${site.wordmark}`, description },
};

export default async function WritersPage() {
  const writers = await listWriters();

  return (
    <>
      <JsonLd
        nodes={[
          listSchema(
            "ScriptLyra writers",
            "/writers",
            writers.map((w) => ({ name: w.name, url: `${site.url}/writers/${w.username}` })),
          ),
          ...writers.map(writerSchema),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Writers", path: "/writers" },
          ]),
        ]}
      />

      <PageHeader
        head="Voices"
        meta={writers.length ? `${writers.length} publishing` : "Open to all"}
        lines={["The people", "writing here."]}
        lead="Anyone with an account can publish to the blog. These are the writers who have — read them, or add your own name to the list."
      />

      {writers.length ? (
        <section className="shell pb-24 sm:pb-32" aria-label="Writers">
          {writers.map((writer, i) => (
            <article
              key={writer.id}
              className="border-rule border-t py-14 first:border-t-0 first:pt-0 sm:py-20"
            >
              <Reveal y={20} delay={i === 0 ? 0 : 0.04}>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
                  <Link
                    href={`/writers/${writer.username}`}
                    className="plate flex max-w-[16rem] items-center justify-center lg:col-span-3 lg:max-w-none"
                    data-ring="Read"
                    aria-label={`${writer.name}${writer.genre ? ` — ${writer.genre}` : ""}`}
                  >
                    <span className="plate-monogram" aria-hidden="true">
                      {initials(writer.name)}
                    </span>
                    {writer.blurb ? (
                      <span className="plate-reveal text-paper absolute inset-0 flex items-end p-5">
                        <span className="t-quote text-[1.0625rem] leading-[1.4]">{writer.blurb}</span>
                      </span>
                    ) : null}
                  </Link>

                  <div className="lg:col-span-8 lg:col-start-5">
                    <h2 className="t-display-m">
                      <Link href={`/writers/${writer.username}`} className="link-rule">
                        {writer.name}
                      </Link>
                    </h2>

                    <dl className="border-rule mt-7 grid grid-cols-2 gap-y-5 border-t pt-5 sm:grid-cols-3">
                      <div>
                        <dt className="t-micro">Writes</dt>
                        <dd className="mt-1 text-[0.9375rem]">{writer.genre || "—"}</dd>
                      </div>
                      <div>
                        <dt className="t-micro">Based in</dt>
                        <dd className="mt-1 text-[0.9375rem]">{writer.based || "—"}</dd>
                      </div>
                      <div>
                        <dt className="t-micro">Pieces</dt>
                        <dd className="t-numeral mt-1 text-[0.9375rem]">{writer.post_count}</dd>
                      </div>
                    </dl>

                    {writer.bio ? (
                      <p className="t-body text-graphite mt-8">{writer.bio.split(/\n{2,}/)[0]}</p>
                    ) : null}
                  </div>
                </div>
              </Reveal>
            </article>
          ))}
        </section>
      ) : (
        <section className="shell pb-24 sm:pb-32" aria-label="Writers">
          <div className="border-rule border-t py-16">
            <p className="t-body-serif text-graphite max-w-[42ch]">
              No one has published yet. Be the first — the list starts with you.
            </p>
            <p className="mt-8">
              <Link href="/signup" className="link-rule text-ink text-[0.9375rem]">
                Create an account and write
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
