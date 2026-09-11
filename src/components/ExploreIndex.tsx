"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import BookCover from "./BookCover";
import FilterBar from "./FilterBar";
import { authors } from "@/lib/authors";
import { books, type Book } from "@/lib/books";
import { stories } from "@/lib/journal";

type Entry = {
  key: string;
  kind: "Book" | "Author" | "Journal";
  subject: string;
  title: string;
  sub: string;
  href: string;
  trailing: string;
  book?: Book;
  initials?: string;
};

const SHOW = ["Everything", "Books", "Authors", "Journal"] as const;
const ALL_SUBJECTS = "All subjects";

const KIND_OF: Record<string, Entry["kind"]> = {
  Books: "Book",
  Authors: "Author",
  Journal: "Journal",
};

const entries: Entry[] = [
  ...books.map<Entry>((book) => ({
    key: `book-${book.slug}`,
    kind: "Book",
    subject: book.genre,
    title: book.title,
    sub: book.author,
    href: `/books/${book.slug}`,
    trailing: book.year,
    book,
  })),
  ...authors.map<Entry>((author) => ({
    key: `author-${author.slug}`,
    kind: "Author",
    subject: author.genre,
    title: author.name,
    sub: author.blurb,
    href: `/authors/${author.slug}`,
    trailing: author.based,
    initials: author.initials,
  })),
  ...stories.map<Entry>((story) => ({
    key: `story-${story.slug}`,
    kind: "Journal",
    subject: story.kind,
    title: story.title,
    sub: story.standfirst,
    href: `/stories#${story.slug}`,
    trailing: story.readingTime,
  })),
];

const subjects = [ALL_SUBJECTS, ...Array.from(new Set(books.map((book) => book.genre)))];

/**
 * One index over the whole house — books, writers and the Journal in a single
 * column, the way a catalogue indexes everything it holds. Filtering narrows
 * the column rather than rearranging the page.
 */
export default function ExploreIndex() {
  const [show, setShow] = useState<string>("Everything");
  const [subject, setSubject] = useState<string>(ALL_SUBJECTS);

  const shown = useMemo(
    () =>
      entries.filter((entry) => {
        if (show !== "Everything" && entry.kind !== KIND_OF[show]) return false;
        if (subject !== ALL_SUBJECTS && entry.subject !== subject) return false;
        return true;
      }),
    [show, subject],
  );

  return (
    <div>
      <FilterBar label="Show" options={[...SHOW]} value={show} onChange={setShow} />
      <FilterBar label="Subject" options={subjects} value={subject} onChange={setSubject} />

      <p className="t-micro mt-6" role="status">
        <span className="t-numeral">{shown.length}</span> of{" "}
        <span className="t-numeral">{entries.length}</span> entries
      </p>

      {shown.length ? (
        <ul className="mt-8">
          {shown.map((entry) => (
            <li key={entry.key} className="border-rule border-t last:border-b">
              <Link
                href={entry.href}
                className="flex items-center gap-5 py-6 sm:gap-8"
                data-ring={entry.kind === "Book" ? "Open" : "Read"}
              >
                <span className="w-12 shrink-0 sm:w-16" aria-hidden="true">
                  {entry.book ? (
                    <BookCover book={entry.book} />
                  ) : entry.initials ? (
                    <span className="plate flex aspect-square items-center justify-center">
                      <span className="plate-monogram text-[1.375rem]">{entry.initials}</span>
                    </span>
                  ) : null}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="t-display-s block max-w-[34ch]">
                    <span className="link-rule">{entry.title}</span>
                  </span>
                  <span className="t-micro mt-1.5 block max-w-[52ch]">{entry.sub}</span>
                </span>

                <span className="t-micro hidden shrink-0 text-right sm:block">
                  {entry.subject}
                  <span className="mt-1 block">{entry.trailing}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      ) : (
        <div className="border-rule mt-8 border-t py-16">
          <p className="t-body-serif">Nothing on the list answers to that yet.</p>
          <button
            type="button"
            className="link-rule text-graphite hover:text-ink mt-5 cursor-pointer text-[0.9375rem]"
            onClick={() => {
              setShow("Everything");
              setSubject(ALL_SUBJECTS);
            }}
          >
            Show everything
          </button>
        </div>
      )}
    </div>
  );
}
