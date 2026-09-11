"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { X } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { EASE_PREMIUM } from "./Motion";
import { books } from "@/lib/books";
import { authors } from "@/lib/authors";
import { stories } from "@/lib/journal";
import { useEscape, useScrollLock } from "@/lib/scroll";

type Result = { href: string; title: string; sub: string; group: string };

const index: Result[] = [
  ...books.map((book) => ({
    href: `/books/${book.slug}`,
    title: book.title,
    sub: `${book.author}, ${book.genre.toLowerCase()}`,
    group: "Books",
  })),
  ...authors.map((author) => ({
    href: `/authors/${author.slug}`,
    title: author.name,
    sub: author.genre,
    group: "Authors",
  })),
  ...stories.map((story) => ({
    href: `/stories#${story.slug}`,
    title: story.title,
    sub: `${story.kind}, ${story.readingTime}`,
    group: "The Journal",
  })),
];

const suggestions = ["Poetry", "Ilya Marren", "Essays", "The Silent City"];

export default function SearchOverlay({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useScrollLock(open);
  useEscape(open, onClose);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const timer = window.setTimeout(() => inputRef.current?.focus(), 220);
    return () => window.clearTimeout(timer);
  }, [open]);

  const results = useMemo(() => {
    const term = query.trim().toLowerCase();
    if (!term) return [];
    return index
      .filter(
        (entry) =>
          entry.title.toLowerCase().includes(term) ||
          entry.sub.toLowerCase().includes(term) ||
          entry.group.toLowerCase().includes(term),
      )
      .slice(0, 8);
  }, [query]);

  const searched = query.trim().length > 0;

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          key="search"
          className="bg-paper/95 fixed inset-0 z-[80] backdrop-blur-2xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.45, ease: EASE_PREMIUM }}
          role="dialog"
          aria-modal="true"
          aria-label="Search"
        >
          <div className="shell flex h-[var(--nav-h)] items-center justify-end">
            <button
              type="button"
              onClick={onClose}
              className="grid size-10 place-items-center rounded-full transition-opacity duration-300 hover:opacity-60"
              aria-label="Close search"
            >
              <X size={20} strokeWidth={1.25} aria-hidden="true" />
            </button>
          </div>

          <motion.div
            className="shell pt-10 sm:pt-16"
            initial={{ y: 18, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.7, ease: EASE_PREMIUM, delay: 0.08 }}
          >
            <div className="mx-auto max-w-3xl">
              <label htmlFor="site-search" className="field-label">
                Search the house
              </label>
              <input
                ref={inputRef}
                id="site-search"
                type="search"
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder="Books, authors, essays"
                autoComplete="off"
                className="field t-display-s mt-3"
              />

              {!searched ? (
                <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-3">
                  {suggestions.map((item) => (
                    <li key={item}>
                      <button
                        type="button"
                        onClick={() => setQuery(item)}
                        className="link-rule t-micro"
                      >
                        {item}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : results.length === 0 ? (
                <p className="t-body text-graphite mt-10">
                  Nothing under that name yet. Try a genre, or an author.
                </p>
              ) : (
                <ul className="mt-8" role="list">
                  {results.map((result) => (
                    <li key={result.href + result.title} className="border-rule border-b">
                      <Link
                        href={result.href}
                        onClick={onClose}
                        className="flex items-baseline justify-between gap-6 py-5"
                      >
                        <span>
                          <span className="t-display-s block">{result.title}</span>
                          <span className="t-micro mt-1 block">{result.sub}</span>
                        </span>
                        <span className="t-micro shrink-0">{result.group}</span>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
