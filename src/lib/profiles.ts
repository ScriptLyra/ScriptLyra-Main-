import { createClient } from "@/lib/supabase/server";
import type { Profile, ProfileLink, WriterSummary } from "@/lib/types";

/** A single public profile by its username, or null. */
export async function profileByUsername(username: string): Promise<Profile | null> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("profiles")
    .select("*")
    .eq("username", username)
    .maybeSingle();
  return (data as Profile) ?? null;
}

/**
 * The /writers directory: every profile with at least one published post,
 * with that count. One query — published posts with their author's profile
 * embedded — folded into per-writer summaries. Ordered by who has published
 * most, then alphabetically.
 */
export async function listWriters(): Promise<WriterSummary[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("posts")
    .select("author_id, profiles!inner(*)")
    .eq("status", "published");

  if (!data) return [];

  const byId = new Map<string, WriterSummary>();
  // The `!inner` embed is a to-one join at runtime, but the generated types
  // infer the relation as an array — cast through unknown to the real shape.
  for (const row of data as unknown as { author_id: string; profiles: Profile }[]) {
    const profile = row.profiles;
    if (!profile) continue;
    const existing = byId.get(row.author_id);
    if (existing) {
      existing.post_count += 1;
    } else {
      byId.set(row.author_id, { ...profile, links: normalizeLinks(profile.links), post_count: 1 });
    }
  }

  return [...byId.values()].sort(
    (a, b) => b.post_count - a.post_count || a.name.localeCompare(b.name),
  );
}

/** `links` is jsonb; guard against a malformed value before rendering. */
export function normalizeLinks(links: unknown): ProfileLink[] {
  if (!Array.isArray(links)) return [];
  return links.filter(
    (l): l is ProfileLink =>
      !!l && typeof l === "object" && typeof (l as ProfileLink).label === "string" && typeof (l as ProfileLink).href === "string",
  );
}
