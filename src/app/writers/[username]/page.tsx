import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import JsonLd from "@/components/JsonLd";
import { MaskedLines, Reveal } from "@/components/Motion";
import { profileByUsername, normalizeLinks } from "@/lib/profiles";
import { publishedPostsByAuthor } from "@/lib/posts";
import { initials } from "@/lib/initials";
import { articleSchema, breadcrumbSchema, writerSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Params = { params: Promise<{ username: string }> };

function pretty(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username } = await params;
  const profile = await profileByUsername(username);
  if (!profile) return { title: "Writer not found" };

  const description = profile.blurb ?? `${profile.name} on ScriptLyra.`;
  return {
    title: profile.name,
    description,
    alternates: { canonical: `/writers/${profile.username}` },
    openGraph: {
      type: "profile",
      title: `${profile.name} — ${site.wordmark}`,
      description,
      url: `/writers/${profile.username}`,
    },
    twitter: { title: `${profile.name} — ${site.wordmark}`, description },
  };
}

export default async function WriterPage({ params }: Params) {
  const { username } = await params;
  const profile = await profileByUsername(username);
  if (!profile) notFound();

  const links = normalizeLinks(profile.links);
  const posts = await publishedPostsByAuthor(profile.id);
  const bioParagraphs = profile.bio ? profile.bio.split(/\n{2,}/).filter(Boolean) : [];

  return (
    <>
      <JsonLd
        nodes={[
          writerSchema(profile),
          ...posts.map((post) =>
            articleSchema(post, { username: profile.username, name: profile.name }),
          ),
          breadcrumbSchema([
            { name: "Home", path: "/" },
            { name: "Writers", path: "/writers" },
            { name: profile.name, path: `/writers/${profile.username}` },
          ]),
        ]}
      />

      <section className="grain-paper relative" data-nav-tone="ink">
        <div className="above-grain shell pt-[calc(var(--nav-h)+3rem)] pb-20 sm:pt-[calc(var(--nav-h)+5rem)] sm:pb-28">
          <nav aria-label="Breadcrumb" className="t-micro">
            <Link href="/writers" className="link-rule">
              Back to the writers
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
                    {initials(profile.name)}
                  </span>
                  {profile.blurb ? (
                    <span className="plate-reveal text-paper absolute inset-0 flex items-end p-6">
                      <span className="t-quote text-[1.0625rem] leading-[1.4]">{profile.blurb}</span>
                    </span>
                  ) : null}
                </div>
              </Reveal>
            </div>

            <div className="lg:col-span-7 lg:col-start-6">
              {profile.genre ? <p className="t-folio italic">{profile.genre}</p> : null}

              <h1 className="t-display-l mt-6 max-w-[16ch]">
                <MaskedLines lines={[profile.name]} delay={0.08} />
              </h1>

              {profile.blurb ? (
                <p className="t-quote text-graphite mt-6 text-[clamp(1.25rem,2vw,1.75rem)]">
                  {profile.blurb}
                </p>
              ) : null}

              {bioParagraphs.length ? (
                <>
                  <hr className="crease mt-10" />
                  <div className="mt-10 space-y-6">
                    {bioParagraphs.map((paragraph, i) => (
                      <p key={i} className="t-body-serif">
                        {paragraph}
                      </p>
                    ))}
                  </div>
                </>
              ) : null}

              <dl className="border-rule mt-14 grid grid-cols-2 gap-y-7 border-t pt-8 sm:grid-cols-3">
                <div>
                  <dt className="t-micro">Writes</dt>
                  <dd className="mt-1.5 text-[0.9375rem]">{profile.genre || "—"}</dd>
                </div>
                <div>
                  <dt className="t-micro">Based in</dt>
                  <dd className="mt-1.5 text-[0.9375rem]">{profile.based || "—"}</dd>
                </div>
                <div>
                  <dt className="t-micro">Pieces published</dt>
                  <dd className="t-numeral mt-1.5 text-[0.9375rem]">{posts.length}</dd>
                </div>
              </dl>

              {links.length ? (
                <ul className="mt-10 flex flex-wrap gap-x-8 gap-y-3">
                  {links.map((link) => (
                    <li key={link.href}>
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

      {posts.length ? (
        <section className="grain-paper relative" data-nav-tone="ink" aria-labelledby="by-writer">
          <div className="above-grain shell pb-24 sm:pb-32">
            <hr className="crease" />

            <h2 id="by-writer" className="t-display-m mt-14">
              {posts.length === 1 ? "Their piece" : "Their writing"}
            </h2>

            <ul className="mt-12">
              {posts.map((post, i) => (
                <li key={post.id} className="border-rule border-t first:border-t-0">
                  <Reveal delay={Math.min(i, 4) * 0.05} y={16}>
                    <Link href={`/blog/${profile.username}/${post.slug}`} className="group block py-8">
                      <div className="grid gap-x-10 gap-y-3 lg:grid-cols-12">
                        <p className="t-micro t-numeral lg:col-span-2">
                          {post.published_at ? pretty(post.published_at) : ""}
                        </p>
                        <div className="lg:col-span-8">
                          <h3 className="t-display-s max-w-[32ch] group-hover:opacity-70 transition-opacity">
                            {post.title}
                          </h3>
                          {post.standfirst ? (
                            <p className="t-body text-graphite mt-3">{post.standfirst}</p>
                          ) : null}
                        </div>
                        <p className="t-micro lg:col-span-2 lg:text-right">
                          {post.kind}
                          <span className="block lg:mt-1">{post.reading_minutes} min</span>
                        </p>
                      </div>
                    </Link>
                  </Reveal>
                </li>
              ))}
            </ul>
          </div>
        </section>
      ) : null}
    </>
  );
}
