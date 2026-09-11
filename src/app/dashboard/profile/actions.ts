"use server";

import { revalidatePath } from "next/cache";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/auth";

export type ProfileState = { error?: string; ok?: boolean };

const linkSchema = z.object({
  label: z.string().trim().min(1).max(40),
  href: z
    .string()
    .trim()
    .min(1)
    .max(300)
    .refine((v) => v.startsWith("/") || /^https?:\/\//.test(v), "Links must start with http(s):// or /"),
});

const profileSchema = z.object({
  name: z.string().trim().min(1, "A name is required.").max(80),
  username: z
    .string()
    .trim()
    .toLowerCase()
    .regex(
      /^[a-z0-9](?:[a-z0-9-]{1,28}[a-z0-9])?$/,
      "Use 3–30 letters, numbers or hyphens, no spaces.",
    ),
  blurb: z.string().trim().max(200),
  bio: z.string().trim().max(6000),
  genre: z.string().trim().max(80),
  based: z.string().trim().max(80),
  links: z.array(linkSchema).max(6),
});

export async function updateProfileAction(
  _prev: ProfileState,
  formData: FormData,
): Promise<ProfileState> {
  const user = await getUser();
  if (!user) return { error: "Your session has expired. Sign in again." };

  let links: unknown = [];
  try {
    links = JSON.parse((formData.get("links") as string) || "[]");
  } catch {
    return { error: "Something went wrong with your links. Try again." };
  }

  const parsed = profileSchema.safeParse({
    name: formData.get("name"),
    username: formData.get("username"),
    blurb: formData.get("blurb") ?? "",
    bio: formData.get("bio") ?? "",
    genre: formData.get("genre") ?? "",
    based: formData.get("based") ?? "",
    links,
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const supabase = await createClient();

  // Username must be unique across everyone but yourself.
  const { data: clash } = await supabase
    .from("profiles")
    .select("id")
    .eq("username", parsed.data.username)
    .neq("id", user.id)
    .maybeSingle();
  if (clash) return { error: "That username is taken. Try another." };

  const { error } = await supabase
    .from("profiles")
    .update({
      name: parsed.data.name,
      username: parsed.data.username,
      blurb: parsed.data.blurb || null,
      bio: parsed.data.bio || null,
      genre: parsed.data.genre || null,
      based: parsed.data.based || null,
      links: parsed.data.links,
    })
    .eq("id", user.id);

  if (error) {
    if (error.code === "23505") return { error: "That username is taken. Try another." };
    return { error: "Could not save your profile. Try again." };
  }

  revalidatePath("/writers");
  revalidatePath(`/writers/${parsed.data.username}`);
  revalidatePath("/dashboard/profile");
  return { ok: true };
}
