import { createBrowserClient } from "@supabase/ssr";

/**
 * The browser client, used inside "use client" components (AuthForm, the
 * account menu, the editor preview). It reads the same public env the server
 * client does; nothing secret lives here.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
  );
}
