import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { profileByUsername } from "@/lib/profiles";
import type { Post, PostWithAuthor } from "@/lib/types";

const FEED_COLUMNS = "*, author:profiles(username, name)";

/** The /blog feed: every published post, newest first, with its byline. */
export async function listPublished(): Promise<PostWithAuthor[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select(FEED_COLUMNS)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data as PostWithAuthor[]) ?? [];
}

/** Published posts by one author (the author is already known), newest first. */
export async function publishedPostsByAuthor(authorId: string): Promise<Post[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", authorId)
    .eq("status", "published")
    .order("published_at", { ascending: false });
  return (data as Post[]) ?? [];
}

/**
 * One post for /blog/[username]/[slug]. Slugs are unique per author, so the
 * pair identifies a single row. RLS means a draft only resolves for its own
 * author — everyone else gets null, which the page turns into a 404.
 */
export async function postByUsernameAndSlug(
  username: string,
  slug: string,
): Promise<PostWithAuthor | null> {
  const profile = await profileByUsername(username);
  if (!profile) return null;

  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", profile.id)
    .eq("slug", slug)
    .maybeSingle();

  if (!data) return null;
  return { ...(data as Post), author: { username: profile.username, name: profile.name } };
}

/** The signed-in author's own posts, drafts included, newest activity first. */
export async function myPosts(): Promise<Post[]> {
  const user = await getUser();
  if (!user) return [];
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("author_id", user.id)
    .order("updated_at", { ascending: false });
  return (data as Post[]) ?? [];
}

/** One of the signed-in author's posts by id, for the editor. */
export async function myPostById(id: string): Promise<Post | null> {
  const user = await getUser();
  if (!user) return null;
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("*")
    .eq("id", id)
    .eq("author_id", user.id)
    .maybeSingle();
  return (data as Post) ?? null;
}
