/** Rows as they come back from Supabase. Kept in one place so the query
 *  helpers, the pages and the server actions all agree on shape. */

/** The kinds a post can be — the Journal's own vocabulary, reused. */
export const POST_KINDS = [
  "Essay",
  "On craft",
  "Interview",
  "Publishing",
  "Behind the book",
  "Notebook",
] as const;

export type PostKind = (typeof POST_KINDS)[number];

export type ProfileLink = { label: string; href: string };

export type Profile = {
  id: string;
  username: string;
  name: string;
  blurb: string | null;
  bio: string | null;
  genre: string | null;
  based: string | null;
  links: ProfileLink[];
  created_at: string;
  updated_at: string;
};

export type PostStatus = "draft" | "published";

export type Post = {
  id: string;
  author_id: string;
  slug: string;
  title: string;
  standfirst: string | null;
  kind: string;
  body_md: string;
  status: PostStatus;
  reading_minutes: number;
  published_at: string | null;
  created_at: string;
  updated_at: string;
};

/** A post with the slice of its author's profile the blog needs for a byline. */
export type PostWithAuthor = Post & {
  author: Pick<Profile, "username" | "name"> | null;
};

/** A writer plus their published-post count, for the /writers directory. */
export type WriterSummary = Profile & { post_count: number };
