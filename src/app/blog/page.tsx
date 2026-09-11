import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import JsonLd from "@/components/JsonLd";
import { Reveal } from "@/components/Motion";
import { listPublished } from "@/lib/posts";
import { readingTimeLabel } from "@/lib/markdown";
import { breadcrumbSchema, listSchema } from "@/lib/schema";
import { site } from "@/lib/site";

const description =
  "Writing from the ScriptLyra community — essays, notes on craft, interviews and dispatches, published by the people on our list.";

export const metadata: Metadata = {
  title: "The Blog",
  description,
  alternates: { canonical: "/blog" },
  openGraph: { title: `The Blog — ${site.wordmark}`, description, url: "/blog" },
  twitter: { title: `The Blog — ${site.wordmark}`, description },
};

function pretty(date: string | null) {
  if (!date) return "—";
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function BlogPage() {
  const posts = await listPublished();
  const [featured, ...rest] = posts;

  return (
    <>
      <JsonLd
        nodes={[
          listSchema(
            "The ScriptLyra Blog",
            "/blog",
            posts.map((post) => ({
              name: post.title,
              url: `${site.url}/blog/${post.author?.username}/${post.slug}`,
            })),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "The Blog", path: "/blog" },
          ]),
        ]}
      />

      <PageHeader
        head="The Blog"
        meta={posts.length ? `${posts.length} published` : "Just opened"}
        lines={["Written by", "the list."]}
        lead="Anyone with a ScriptLyra account can publish here. Essays, notes on craft, and dispatches from work in progress — straight from the people writing the books."
      />

      {featured ? (
        <>
          <section className="shell pb-8" aria-label="Latest post">
            <article className="scroll-mt-28">
              <Reveal y={22}>
                <div className="grid gap-8 lg:grid-cols-12 lg:gap-14">
                  <div className="lg:col-span-8">
                    <p className="t-micro border-rule flex items-baseline justify-between border-b pb-3">
                      <span>{featured.kind}</span>
                      <span>{readingTimeLabel(featured.reading_minutes)}</span>
                    </p>

                    <h2 className="t-display-l mt-8 max-w-[24ch]">
                      <Link
                        href={`/blog/${featured.author?.username}/${featured.slug}`}
                        className="link-rule"
                      >
                        {featured.title}
                      </Link>
                    </h2>

                    {featured.standfirst ? (
                      <p className="t-body-serif text-graphite mt-8">{featured.standfirst}</p>
                    ) : null}
                  </div>

                  <div className="lg:col-span-3 lg:col-start-10 lg:self-end">
                    <dl className="border-rule border-t pt-5">
                      <dt className="t-micro">Written by</dt>
                      <dd className="mt-1 text-[0.9375rem]">
                        {featured.author ? (
                          <Link href={`/writers/${featured.author.username}`} className="link-rule">
                            {featured.author.name}
                          </Link>
                        ) : (
                          "—"
                        )}
                      </dd>
                      <dt className="t-micro mt-5">Published</dt>
                      <dd className="t-numeral mt-1 text-[0.9375rem]">
                        {pretty(featured.published_at)}
                      </dd>
                    </dl>
                  </div>
                </div>
              </Reveal>
            </article>
          </section>

          {rest.length ? (
            <section className="shell pb-24 sm:pb-32" aria-label="Earlier posts">
              <ul className="mt-16 sm:mt-24">
                {rest.map((post, i) => (
                  <li key={post.id} className="border-rule border-t">
                    <article className="scroll-mt-28">
                      <Reveal delay={Math.min(i, 3) * 0.05} y={16}>
                        <div className="grid gap-x-10 gap-y-4 py-9 lg:grid-cols-12">
                          <p className="t-micro t-numeral lg:col-span-2">
                            {pretty(post.published_at)}
                          </p>

                          <div className="lg:col-span-7">
                            <h3 className="t-display-s max-w-[32ch]">
                              <Link
                                href={`/blog/${post.author?.username}/${post.slug}`}
                                className="link-rule"
                              >
                                {post.title}
                              </Link>
                            </h3>
                            {post.standfirst ? (
                              <p className="t-body text-graphite mt-3">{post.standfirst}</p>
                            ) : null}
                          </div>

                          <p className="t-micro lg:col-span-3 lg:text-right">
                            {post.kind}
                            <span className="block lg:mt-1">
                              {post.author?.name}, {readingTimeLabel(post.reading_minutes)}
                            </span>
                          </p>
                        </div>
                      </Reveal>
                    </article>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <div className="shell pb-24 sm:pb-32" />
          )}
        </>
      ) : (
        <section className="shell pb-24 sm:pb-32" aria-label="No posts yet">
          <div className="border-rule border-t py-16">
            <p className="t-body-serif text-graphite max-w-[46ch]">
              No posts yet — the ink is still wet. Be the first to publish something here.
            </p>
            <p className="mt-8 flex flex-wrap gap-x-6 gap-y-2">
              <Link href="/write" className="link-rule text-ink text-[0.9375rem]">
                Write a post
              </Link>
              <Link href="/signup" className="link-rule text-[0.9375rem]">
                Create an account
              </Link>
            </p>
          </div>
        </section>
      )}
    </>
  );
}
