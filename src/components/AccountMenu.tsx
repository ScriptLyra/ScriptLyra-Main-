"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { createClient } from "@/lib/supabase/client";
import { initials } from "@/lib/initials";
import { signOutAction } from "@/app/(auth)/actions";
import { useEscape } from "@/lib/scroll";

/**
 * The only piece of the chrome that knows whether you are signed in. It reads
 * the session in the browser and subscribes to changes, so the marketing pages
 * around it can stay statically rendered — the layout never touches cookies.
 *
 * Until the session resolves it renders a fixed-size placeholder, so the bar
 * does not jump and there is no signed-out flash for a signed-in reader.
 */
export default function AccountMenu({ inverted }: { inverted: boolean }) {
  const supabase = createClient();
  const pathname = usePathname();
  const [user, setUser] = useState<User | null>(null);
  const [ready, setReady] = useState(false);
  const [open, setOpen] = useState(false);
  const wrapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let active = true;
    supabase.auth.getUser().then(({ data }) => {
      if (!active) return;
      setUser(data.user);
      setReady(true);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setReady(true);
    });

    return () => {
      active = false;
      subscription.unsubscribe();
    };
  }, [supabase]);

  useEscape(open, () => setOpen(false));

  // Close on outside click and whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onClick = (event: MouseEvent) => {
      if (!wrapRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("pointerdown", onClick);
    return () => document.removeEventListener("pointerdown", onClick);
  }, [open]);

  // Reserve the slot while we do not yet know the answer.
  if (!ready) return <span className="block size-10" aria-hidden="true" />;

  if (!user) {
    return (
      <Link
        href="/signin"
        className="link-rule hidden text-[0.9375rem] transition-opacity duration-300 hover:opacity-70 sm:inline"
      >
        Sign in
      </Link>
    );
  }

  const name = (user.user_metadata?.name as string | undefined) ?? user.email ?? "You";
  const items = [
    { label: "Your writing", href: "/dashboard" },
    { label: "Your profile", href: "/dashboard/profile" },
  ];

  return (
    <div ref={wrapRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={`grid size-10 place-items-center rounded-full border text-[0.8125rem] transition-colors duration-300 ${
          inverted ? "border-white/25 hover:border-white/60" : "border-rule hover:border-ink"
        }`}
        style={{ fontFamily: "var(--font-display)" }}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Your account"
      >
        {initials(name)}
      </button>

      {open ? (
        <div
          role="menu"
          className="bg-paper text-ink border-rule absolute right-0 top-[calc(100%+0.6rem)] z-[85] w-56 border p-2 shadow-[0_24px_60px_-30px_rgba(0,0,0,0.35)]"
        >
          <p className="t-micro truncate px-3 pb-2 pt-1" title={name}>
            {name}
          </p>
          <hr className="border-rule" />
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              role="menuitem"
              className="hover:bg-leaf block rounded-sm px-3 py-2.5 text-[0.9375rem] transition-colors duration-200"
            >
              {item.label}
            </Link>
          ))}
          <hr className="border-rule" />
          <form action={signOutAction}>
            <button
              type="submit"
              role="menuitem"
              className="hover:bg-leaf block w-full rounded-sm px-3 py-2.5 text-left text-[0.9375rem] transition-colors duration-200"
            >
              Sign out
            </button>
          </form>
        </div>
      ) : null}
    </div>
  );
}
