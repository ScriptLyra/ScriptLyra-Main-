"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import type { User } from "@supabase/supabase-js";
import Lockup from "./Lockup";
import Button from "./Button";
import { EASE_PREMIUM } from "./Motion";
import { primaryNav } from "@/lib/site";
import { useEscape, useScrollLock } from "@/lib/scroll";
import { createClient } from "@/lib/supabase/client";
import { signOutAction } from "@/app/(auth)/actions";

const links = [
  ...primaryNav,
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
];

const elsewhere = [
  { label: "Instagram", href: "https://instagram.com" },
  { label: "LinkedIn", href: "https://linkedin.com" },
  { label: "X", href: "https://x.com" },
  { label: "YouTube", href: "https://youtube.com" },
];

/**
 * The menu is a sheet of ink drawn down over the page — the same gesture as the
 * opening sequence, run in the other direction.
 */
export default function MobileMenu({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  const restoreRef = useRef<HTMLElement | null>(null);
  const [user, setUser] = useState<User | null>(null);

  useScrollLock(open);
  useEscape(open, onClose);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (open) {
      restoreRef.current = document.activeElement as HTMLElement | null;
      const timer = window.setTimeout(() => closeRef.current?.focus(), 240);
      return () => window.clearTimeout(timer);
    }
    restoreRef.current?.focus?.();
  }, [open]);

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="menu"
          className="on-ink grain-ink bg-ink text-paper fixed inset-0 z-[80] lg:hidden"
          initial={{ y: "-100%" }}
          animate={{ y: 0 }}
          exit={{ y: "-100%" }}
          transition={{ duration: 0.85, ease: EASE_PREMIUM }}
          role="dialog"
          aria-modal="true"
          aria-label="Menu"
        >
          <div className="above-grain flex h-full flex-col">
            <div className="shell flex h-[var(--nav-h)] shrink-0 items-center justify-between">
              <Link href="/" onClick={onClose} aria-label="ScriptLyra — home">
                <Lockup className="w-[8.25rem]" tone="paper" label="ScriptLyra" />
              </Link>
              <button
                ref={closeRef}
                type="button"
                onClick={onClose}
                className="grid size-10 place-items-center rounded-full transition-opacity duration-300 hover:opacity-60"
                aria-label="Close menu"
              >
                <X size={20} strokeWidth={1.25} aria-hidden="true" />
              </button>
            </div>

            <nav aria-label="Menu" className="shell flex-1 overflow-y-auto pt-6 pb-10">
              <ul>
                {links.map((item, i) => (
                  <li key={item.href} className="border-b border-white/10">
                    <span className="block overflow-hidden">
                      <motion.span
                        className="block"
                        initial={{ y: "110%" }}
                        animate={{ y: "0%" }}
                        transition={{
                          duration: 0.8,
                          ease: EASE_PREMIUM,
                          delay: 0.24 + i * 0.055,
                        }}
                      >
                        <Link
                          href={item.href}
                          onClick={onClose}
                          className="t-display-m block py-4"
                        >
                          {item.label}
                        </Link>
                      </motion.span>
                    </span>
                  </li>
                ))}
              </ul>

              <motion.div
                className="mt-10 flex flex-col gap-8"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.62 }}
              >
                <Button href="/write" variant="paper" arrow onClick={onClose}>
                  Start writing
                </Button>

                {user ? (
                  <ul className="flex flex-col gap-4">
                    <li>
                      <Link href="/dashboard" onClick={onClose} className="link-rule text-paper text-[0.9375rem]">
                        Your writing
                      </Link>
                    </li>
                    <li>
                      <Link href="/dashboard/profile" onClick={onClose} className="link-rule text-paper text-[0.9375rem]">
                        Your profile
                      </Link>
                    </li>
                    <li>
                      <form action={signOutAction}>
                        <button type="submit" className="link-rule text-paper/70 text-[0.9375rem]">
                          Sign out
                        </button>
                      </form>
                    </li>
                  </ul>
                ) : (
                  <ul className="flex flex-wrap gap-x-7 gap-y-3">
                    <li>
                      <Link href="/signin" onClick={onClose} className="link-rule text-paper text-[0.9375rem]">
                        Sign in
                      </Link>
                    </li>
                    <li>
                      <Link href="/signup" onClick={onClose} className="link-rule text-paper/70 text-[0.9375rem]">
                        Create an account
                      </Link>
                    </li>
                  </ul>
                )}

                <ul className="flex flex-wrap gap-x-7 gap-y-3">
                  {elsewhere.map((item) => (
                    <li key={item.label}>
                      <a
                        href={item.href}
                        className="link-rule text-paper/60 text-sm"
                        target="_blank"
                        rel="noreferrer noopener"
                      >
                        {item.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </nav>
          </div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
