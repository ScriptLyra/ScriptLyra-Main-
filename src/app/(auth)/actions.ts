"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { site } from "@/lib/site";

export type AuthState = { error?: string; message?: string };

const emailField = z.string().trim().toLowerCase().email("Enter a valid email address.");
const passwordField = z.string().min(8, "Use at least eight characters.");

/** Only ever redirect to a path on this site. */
function safeNext(value: FormDataEntryValue | null): string {
  const next = typeof value === "string" ? value : "";
  return next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
}

/**
 * The origin this request actually came in on, so a confirmation email points
 * back where the user is — localhost in development, the real host in
 * production — rather than at a baked-in URL.
 *
 * Priority:
 *   1. NEXT_PUBLIC_SITE_URL  — explicitly set by us (most reliable)
 *   2. VERCEL_URL            — auto-set by Vercel on every deployment
 *   3. origin / host headers — works in local dev
 *   4. site.url              — absolute last resort
 */
async function requestOrigin(): Promise<string> {
  // Explicit site URL takes precedence — guarantees production correctness.
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL.replace(/\/+$/, "");
  }

  // Vercel auto-injects VERCEL_URL (no protocol prefix).
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }

  // Fall back to the request headers — reliable in local dev.
  const h = await headers();
  const origin = h.get("origin");
  if (origin) return origin;
  const host = h.get("host");
  if (host) return `${h.get("x-forwarded-proto") ?? "http"}://${host}`;
  return site.url;
}

const signUpSchema = z.object({
  name: z.string().trim().min(1, "Tell us what to call you.").max(80),
  email: emailField,
  password: passwordField,
});

export async function signUpAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signUpSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      data: { name: parsed.data.name },
      emailRedirectTo: `${await requestOrigin()}/auth/confirm`,
    },
  });

  if (error) return { error: error.message };

  // With email confirmation on, there is no session yet — ask them to confirm.
  // With it off, Supabase returns a session and we can go straight in.
  if (data.session) redirect("/dashboard");

  return {
    message:
      "Check your email. We have sent a link that confirms the address and signs you in.",
  };
}

const signInSchema = z.object({ email: emailField, password: z.string().min(1, "Enter your password.") });

export async function signInAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = signInSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });
  if (!parsed.success) {
    return { error: parsed.error.issues[0]?.message ?? "Check the form and try again." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword(parsed.data);

  if (error) return { error: "Those details do not match an account." };

  redirect(safeNext(formData.get("next")));
}

export async function sendMagicLinkAction(_prev: AuthState, formData: FormData): Promise<AuthState> {
  const parsed = emailField.safeParse(formData.get("email"));
  if (!parsed.success) return { error: parsed.error.issues[0]?.message ?? "Enter a valid email." };

  const next = safeNext(formData.get("next"));
  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email: parsed.data,
    options: { emailRedirectTo: `${await requestOrigin()}/auth/confirm?next=${encodeURIComponent(next)}` },
  });

  if (error) return { error: error.message };
  return { message: "Check your email for a link to sign in — no password needed." };
}

export async function signInWithGoogleAction() {
  const supabase = await createClient();
  const origin = await requestOrigin();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: "google",
    options: {
      redirectTo: `${origin}/auth/callback`,
      queryParams: {
        access_type: "offline",
        prompt: "consent",
      },
    },
  });

  if (error || !data.url) {
    redirect("/signin?error=google");
  }

  redirect(data.url);
}

export async function signOutAction() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/");
}
