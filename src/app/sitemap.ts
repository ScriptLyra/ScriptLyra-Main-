import type { MetadataRoute } from "next";
import { createClient } from "@supabase/supabase-js";
import { books } from "@/lib/books";
import { authors } from "@/lib/authors";
import { site } from "@/lib/site";

/** The shape we read for the sitemap — a post with its author's handle. */
type Row = {
  slug: string;
  updated_at: string | null;
  published_at: string | null;
  author: { username: string | null; updated_at: string | null } | null;
};

/**
 * Published posts and their writers, read with a plain anon client — no
 * cookies, because the sitemap is the same for every visitor. If Supabase is
 * not configured yet, or the request fails, we return nothing and still ship a
 * valid sitemap of the static pages.
 */
async function dynamicEntries(now: Date): Promise<MetadataRoute.Sitemap> {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !anon) return [];

  try {
    const supabase = createClient(url, anon);
    const { data } = await supabase
      .from("posts")
      .select("slug, updated_at, published_at, author:profiles(username, updated_at)")
      .eq("status", "published")
      .order("published_at", { ascending: false });

    const rows = (data ?? []) as unknown as Row[];

    const postEntries: MetadataRoute.Sitemap = rows
      .filter((row) => row.author?.username)
      .map((row) => ({
        url: `${site.url}/blog/${row.author!.username}/${row.slug}`,
        lastModified: new Date(row.updated_at ?? row.published_at ?? now),
        changeFrequency: "weekly" as const,
        priority: 0.5,
      }));

    // One entry per writer with at least one published post, dated to their
    // most recent activity.
    const writers = new Map<string, Date>();
    for (const row of rows) {
      const username = row.author?.username;
      if (!username) continue;
      const when = new Date(row.author?.updated_at ?? row.published_at ?? now);
      const existing = writers.get(username);
      if (!existing || when > existing) writers.set(username, when);
    }
    const writerEntries: MetadataRoute.Sitemap = [...writers].map(([username, when]) => ({
      url: `${site.url}/writers/${username}`,
      lastModified: when,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    }));

    return [...postEntries, ...writerEntries];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();

  const pages = [
    "",
    "/explore",
    "/books",
    "/authors",
    "/publish",
    "/about",
    "/stories",
    "/contact",
    "/blog",
    "/writers",
  ];

  return [
    ...pages.map((path) => ({
      url: `${site.url}${path}`,
      lastModified: now,
      changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
      priority: path === "" ? 1 : 0.7,
    })),
    ...books.flatMap((book) => [
      {
        url: `${site.url}/books/${book.slug}`,
        lastModified: new Date(book.published),
        changeFrequency: "yearly" as const,
        priority: 0.6,
      },
      {
        url: `${site.url}/books/${book.slug}/read`,
        lastModified: new Date(book.published),
        changeFrequency: "yearly" as const,
        priority: 0.4,
      },
    ]),
    ...authors.map((author) => ({
      url: `${site.url}/authors/${author.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
    ...(await dynamicEntries(now)),
  ];
}
