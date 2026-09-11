import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * The server client, for React Server Components, server actions and route
 * handlers. It reads and writes the session cookies through Next's cookie
 * store. In a plain RSC render the store is read-only and `setAll` throws;
 * that is expected — the middleware is what actually refreshes the cookie — so
 * we swallow it, exactly as the Supabase SSR guide prescribes.
 */
export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet: { name: string; value: string; options: CookieOptions }[]) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component render — safe to ignore.
          }
        },
      },
    },
  );
}
