"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";
import { readingMinutes, slugify } from "@/lib/markdown";
import { POST_KINDS } from "@/lib/types";
import type { SupabaseClient } from "@supabase/supabase-js";

export type PostState = { error?: string; ok?: boolean; id?: string };

const postSchema = z.object({
  title: z.string().trim().min(1, "Give it a title.").max(160),
  standfirst: z.string().trim().max(280),
  kind: z.enum(POST_KINDS).catch("Essay"),
  body_md: z.string().max(120_000),
});

/** A slug unique to this author, appending -2, -3… on collision. */
async function uniqueSlug(
  supabase: SupabaseClient,
  authorId: string,
  base: string,
  excludeId?: string,
): Promise<string> {
  let candidate = base;
  let n = 2;
  // Small loop; a writer will not have thousands of same-titled posts.
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let query = supabase
      .from("posts")
      .select("id")
      .eq("author_id", authorId)
      .eq("slug", candidate);
    if (excludeId) query = query.neq("id", excludeId);
    const { data } = await query.maybeSingle();
    if (!data) return candidate;
    candidate = `${base}-${n++}`;
  }
}

function readForm(formData: FormData) {
  return postSchema.safeParse({
    title: formData.get("title"),
    standfirst: formData.get("standfirst") ?? "",
    kind: formData.get("kind") ?? "Essay",
    body_md: formData.get("body_md") ?? "",
  });
}

/**
 * Create or update a draft. A brand-new post is inserted and the browser is
 * sent to /write/[id] so the URL matches the saved row; editing an existing
 * post updates in place and reports back. The slug is set once, from the first
 * title, and then left alone so a published URL never moves.
 */
export async function savePostAction(_prev: PostState, formData: FormData): Promise<PostState> {
  const user = await getUser();
  if (!user) return { error: "Your session has expired. Sign in again." };

  const parsed = readForm(formData);
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Check the form." };

  const supabase = await createClient();
  const id = (formData.get("id") as string) || null;
  const reading = readingMinutes(parsed.data.body_md);

  if (id) {
    const { error } = await supabase
      .from("posts")
      .update({
        title: parsed.data.title,
        standfirst: parsed.data.standfirst || null,
        kind: parsed.data.kind,
        body_md: parsed.data.body_md,
        reading_minutes: reading,
      })
      .eq("id", id)
      .eq("author_id", user.id);
    if (error) return { error: "Could not save. Try again." };

    revalidatePath("/blog");
    return { ok: true, id };
  }

  const slug = await uniqueSlug(supabase, user.id, slugify(parsed.data.title));
  const { data, error } = await supabase
    .from("posts")
    .insert({
      author_id: user.id,
      slug,
      title: parsed.data.title,
      standfirst: parsed.data.standfirst || null,
      kind: parsed.data.kind,
      body_md: parsed.data.body_md,
      reading_minutes: reading,
      status: "draft",
    })
    .select("id")
    .single();

  if (error || !data) return { error: "Could not create the post. Try again." };
  redirect(`/write/${data.id}`);
}

/** Publish a post and go to its public page. */
export async function publishPostAction(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/signin");
  const id = formData.get("id") as string;
  if (!id) redirect("/dashboard");

  const supabase = await createClient();

  const { data: existing } = await supabase
    .from("posts")
    .select("published_at, slug")
    .eq("id", id)
    .eq("author_id", user.id)
    .maybeSingle();
  if (!existing) redirect("/dashboard");

  await supabase
    .from("posts")
    .update({
      status: "published",
      published_at: existing.published_at ?? new Date().toISOString(),
    })
    .eq("id", id)
    .eq("author_id", user.id);

  const { data: profile } = await supabase
    .from("profiles")
    .select("username")
    .eq("id", user.id)
    .single();

  revalidatePath("/blog");
  if (profile) revalidatePath(`/writers/${profile.username}`);
  redirect(profile ? `/blog/${profile.username}/${existing.slug}` : "/dashboard");
}

/** Return a published post to draft. */
export async function unpublishPostAction(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/signin");
  const id = formData.get("id") as string;
  if (!id) redirect("/dashboard");

  const supabase = await createClient();
  await supabase
    .from("posts")
    .update({ status: "draft" })
    .eq("id", id)
    .eq("author_id", user.id);

  revalidatePath("/blog");
  redirect("/dashboard");
}

/** Delete a post for good. */
export async function deletePostAction(formData: FormData) {
  const user = await getUser();
  if (!user) redirect("/signin");
  const id = formData.get("id") as string;
  if (!id) redirect("/dashboard");

  const supabase = await createClient();
  await supabase.from("posts").delete().eq("id", id).eq("author_id", user.id);

  revalidatePath("/blog");
  redirect("/dashboard");
}
