import type { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/PageHeader";
import { Reveal } from "@/components/Motion";
import { requireProfile } from "@/lib/auth";
import { myPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: "Your writing",
  robots: { index: false, follow: false },
};

function pretty(date: string) {
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" });
}

export default async function DashboardPage() {
  const profile = await requireProfile();
  const posts = await myPosts();
  const drafts = posts.filter((p) => p.status === "draft");
  const published = posts.filter((p) => p.status === "published");

  return (
    <>
      <PageHeader
        head="Your writing"
        meta={`${posts.length} in all`}
        lines={[`Hello,`, `${profile.name.split(" ")[0]}.`]}
        lead="Everything you have written lives here — drafts to finish and pieces already out in the world."
      />

      <section className="shell pb-24 sm:pb-32" aria-label="Your posts">
        <div className="border-rule flex flex-wrap items-center justify-between gap-4 border-b pb-6">
          <p className="t-micro">
            <Link href="/dashboard/profile" className="link-rule text-ink">
              Edit your profile
            </Link>
            <span className="text-graphite"> · </span>
            <Link href={`/writers/${profile.username}`} className="link-rule">
              Your public page
            </Link>
          </p>
          <Link href="/write" className="btn btn-ink px-5 py-3 text-sm">
            <span>New post</span>
          </Link>
        </div>

        {posts.length === 0 ? (
          <div className="py-16">
            <p className="t-body-serif text-graphite max-w-[44ch]">
              Nothing here yet. Your first piece is the hardest to start and the easiest to
              finish — begin it now.
            </p>
            <p className="mt-8">
              <Link href="/write" className="link-rule text-ink text-[0.9375rem]">
                Write your first post
              </Link>
            </p>
          </div>
        ) : (
          <div className="mt-12 space-y-16">
            {drafts.length ? (
              <div>
                <h2 className="t-micro">Drafts</h2>
                <ul className="mt-5">
                  {drafts.map((post, i) => (
                    <li key={post.id} className="border-rule border-t first:border-t-0">
                      <Reveal delay={Math.min(i, 4) * 0.04} y={14}>
                        <Link href={`/write/${post.id}`} className="group block py-7">
                          <div className="grid gap-x-8 gap-y-2 lg:grid-cols-12">
                            <p className="t-micro t-numeral lg:col-span-2">
                              {pretty(post.updated_at)}
                            </p>
                            <div className="lg:col-span-8">
                              <h3 className="t-display-s group-hover:opacity-70 transition-opacity">
                                {post.title || "Untitled"}
                              </h3>
                              {post.standfirst ? (
                                <p className="t-body text-graphite mt-2">{post.standfirst}</p>
                              ) : null}
                            </div>
                            <p className="t-micro lg:col-span-2 lg:text-right">
                              {post.kind}
                              <span className="block lg:mt-1">Edit →</span>
                            </p>
                          </div>
                        </Link>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}

            {published.length ? (
              <div>
                <h2 className="t-micro">Published</h2>
                <ul className="mt-5">
                  {published.map((post, i) => (
                    <li key={post.id} className="border-rule border-t first:border-t-0">
                      <Reveal delay={Math.min(i, 4) * 0.04} y={14}>
                        <div className="grid items-baseline gap-x-8 gap-y-2 py-7 lg:grid-cols-12">
                          <p className="t-micro t-numeral lg:col-span-2">
                            {post.published_at ? pretty(post.published_at) : "—"}
                          </p>
                          <div className="lg:col-span-8">
                            <h3 className="t-display-s">
                              <Link
                                href={`/blog/${profile.username}/${post.slug}`}
                                className="link-rule"
                              >
                                {post.title}
                              </Link>
                            </h3>
                            {post.standfirst ? (
                              <p className="t-body text-graphite mt-2">{post.standfirst}</p>
                            ) : null}
                          </div>
                          <p className="t-micro lg:col-span-2 lg:text-right">
                            <Link href={`/write/${post.id}`} className="link-rule text-ink">
                              Edit
                            </Link>
                          </p>
                        </div>
                      </Reveal>
                    </li>
                  ))}
                </ul>
              </div>
            ) : null}
          </div>
        )}
      </section>
    </>
  );
}
