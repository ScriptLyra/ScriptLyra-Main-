import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Button from "@/components/Button";
import JsonLd from "@/components/JsonLd";
import Markdown from "@/components/Markdown";
import ReadingProgress from "@/components/ReadingProgress";
import { postByUsernameAndSlug } from "@/lib/posts";
import { readingTimeLabel } from "@/lib/markdown";
import { initials } from "@/lib/initials";
import { articleSchema, breadcrumbSchema } from "@/lib/schema";
import { site } from "@/lib/site";

type Params = { params: Promise<{ username: string; slug: string }> };

function pretty(date: string | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export async function generateMetadata({ params }: Params): Promise<Metadata> {
  const { username, slug } = await params;
  const post = await postByUsernameAndSlug(username, slug);

  if (!post || !post.author) return { title: "Post not found" };

  const url = `/blog/${post.author.username}/${post.slug}`;
  const description = post.standfirst || `A post by ${post.author.name} on ScriptLyra.`;
  const draft = post.status !== "published";

  return {
    title: post.title,
    description,
    // A draft is only ever visible to its own author; keep it out of the index.
    robots: draft ? { index: false, follow: false } : undefined,
    alternates: { canonical: url },
    authors: [{ name: post.author.name, url: `${site.url}/writers/${post.author.username}` }],
    openGraph: {
      type: "article",
      title: `${post.title} — ${site.wordmark}`,
      description,
      url,
      ...(post.published_at ? { publishedTime: post.published_at } : {}),
      authors: [post.author.name],
    },
    twitter: { title: `${post.title} — ${site.wordmark}`, description },
  };
}

export default async function PostPage({ params }: Params) {
  const { username, slug } = await params;
  const post = await postByUsernameAndSlug(username, slug);

  if (!post || !post.author) notFound();

  const published = pretty(post.published_at);
  const draft = post.status !== "published";

  return (
    <>
      {!draft ? (
        <JsonLd
          nodes={[
            articleSchema(post, post.author),
            breadcrumbSchema([
              { name: "Home", path: "/" },
              { name: "The Blog", path: "/blog" },
              { name: post.title, path: `/blog/${post.author.username}/${post.slug}` },
            ]),
          ]}
        />
      ) : null}

      <ReadingProgress />

      <article className="grain-paper relative" data-nav-tone="ink">
        <div className="above-grain shell pt-[calc(var(--nav-h)+3rem)] pb-24 sm:pb-32">
          <div className="mx-auto max-w-[42rem]">
            <p className="t-micro flex items-baseline justify-between gap-6">
              <span>{post.kind}</span>
              <span>{readingTimeLabel(post.reading_minutes)}</span>
            </p>

            <hr className="crease mt-5" />

            {draft ? (
              <p className="t-micro border-ink/20 mt-8 border-l-2 pl-4">
                Draft — only you can see this. Publish it from{" "}
                <Link href={`/write/${post.id}`} className="link-rule text-ink">
                  the editor
                </Link>
                .
              </p>
            ) : null}

            <h1 className="t-display-m mt-12">{post.title}</h1>

            {post.standfirst ? (
              <p className="t-body-serif text-graphite mt-6">{post.standfirst}</p>
            ) : null}

            <p className="t-micro mt-6">
              <Link href={`/writers/${post.author.username}`} className="link-rule text-ink">
                {post.author.name}
              </Link>
              {published ? <span className="text-graphite"> · {published}</span> : null}
            </p>

            {/* The reading column: one measure, house prose styling, nothing in
                the margins to look at. */}
            <div className="mt-14">
              <Markdown>{post.body_md}</Markdown>
            </div>

            <hr className="crease mt-16" />

            {/* Byline card — the same monogram disc the chrome uses. */}
            <div className="mt-12 flex items-start gap-5">
              <span
                className="border-rule grid size-14 shrink-0 place-items-center rounded-full border text-[0.9375rem]"
                style={{ fontFamily: "var(--font-display)" }}
                aria-hidden="true"
              >
                {initials(post.author.name)}
              </span>
              <div>
                <p className="t-micro">Written by</p>
                <p className="t-display-s mt-1">
                  <Link href={`/writers/${post.author.username}`} className="link-rule">
                    {post.author.name}
                  </Link>
                </p>
                <p className="mt-4">
                  <Link
                    href={`/writers/${post.author.username}`}
                    className="link-rule text-[0.9375rem]"
                  >
                    Read more from this writer →
                  </Link>
                </p>
              </div>
            </div>

            <div className="mt-14 flex flex-wrap items-center gap-7">
              <Button href="/blog" variant="ink">
                More from the blog
              </Button>
              <Link href="/writers" className="link-rule text-[0.9375rem]">
                All the writers
              </Link>
            </div>
          </div>
        </div>
      </article>
    </>
  );
}
