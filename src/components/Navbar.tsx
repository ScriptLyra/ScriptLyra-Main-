"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { Menu, Search } from "lucide-react";
import Lockup from "./Lockup";
import Button from "./Button";
import MobileMenu from "./MobileMenu";
import SearchOverlay from "./SearchOverlay";
import AccountMenu from "./AccountMenu";
import { primaryNav } from "@/lib/site";

/**
 * The navbar is transparent over the opening page and settles into a frosted
 * paper bar once you start reading. Where an ink passage passes beneath it, it
 * inverts — so the black sections read as deliberate rather than as a header
 * that stopped working.
 */
export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [inverted, setInverted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-nav-tone]"));

    const read = () => {
      setScrolled(window.scrollY > 10);

      // The trigger line sits at the optical centre of the bar. Sections can
      // stack (the book showcase does), so the tone is decided by the last
      // marked section crossing the line — last in the document is the one
      // painted on top.
      const line = 34;
      let tone: string | undefined;
      for (const zone of zones) {
        const rect = zone.getBoundingClientRect();
        if (rect.top <= line && rect.bottom > line) tone = zone.dataset.navTone;
      }
      setInverted(tone === "paper");
    };

    read();
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, [pathname]);

  const ground = inverted
    ? "bg-ink/85 border-white/12 text-paper"
    : scrolled
      ? "bg-paper/80 border-rule text-ink"
      : "border-transparent text-ink";

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-[70] border-b backdrop-blur-xl transition-[background-color,border-color,color] duration-500 ${ground}`}
        style={{ transitionTimingFunction: "cubic-bezier(0.16,1,0.3,1)" }}
      >
        <div className="shell flex h-[var(--nav-h)] items-center justify-between gap-8">
          <Link
            href="/"
            className="shrink-0"
            aria-label="ScriptLyra — home"
            onClick={() => setMenuOpen(false)}
          >
            <Lockup
              className={`w-[8.25rem] transition-[filter] duration-500 sm:w-[9.25rem] ${inverted ? "invert" : ""}`}
              label="ScriptLyra"
            />
          </Link>

          <nav aria-label="Primary" className="hidden lg:block">
            <ul className="flex items-center gap-9">
              {primaryNav.map((item) => {
                const active = pathname === item.href || pathname.startsWith(`${item.href}/`);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      className={`link-rule text-[0.9375rem] transition-opacity duration-300 ${active ? "opacity-100" : "opacity-65 hover:opacity-100"}`}
                      aria-current={active ? "page" : undefined}
                    >
                      {item.label}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-2 sm:gap-4">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="grid size-10 place-items-center rounded-full transition-opacity duration-300 hover:opacity-60"
              aria-label="Search ScriptLyra"
            >
              <Search size={18} strokeWidth={1.25} aria-hidden="true" />
            </button>

            <div className="hidden sm:block">
              <Button
                href="/write"
                variant={inverted ? "paper" : "ink"}
                className="px-5 py-3 text-sm"
              >
                Start writing
              </Button>
            </div>

            <AccountMenu inverted={inverted} />

            <button
              type="button"
              onClick={() => setMenuOpen(true)}
              className="grid size-10 place-items-center rounded-full transition-opacity duration-300 hover:opacity-60 lg:hidden"
              aria-label="Open menu"
              aria-expanded={menuOpen}
            >
              <Menu size={20} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>
        </div>
      </header>

      <MobileMenu open={menuOpen} onClose={() => setMenuOpen(false)} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}
