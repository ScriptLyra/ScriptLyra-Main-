import Link from "next/link";
import BookCover from "./BookCover";
import type { Book } from "@/lib/books";

/**
 * A title as it appears in a list: the cover, then the three facts a reader
 * decides on. The cover takes a slight turn towards the pointer, which is the
 * only 3D on the site.
 */
export default function BookCard({ book }: { book: Book }) {
  return (
    <article className="book-tilt">
      <Link
        href={`/books/${book.slug}`}
        data-ring="Open"
        className="block"
        aria-label={`${book.title} by ${book.author}`}
      >
        <BookCover book={book} />
      </Link>

      <h3 className="t-display-s mt-5">
        <Link href={`/books/${book.slug}`} className="link-rule">
          {book.title}
        </Link>
      </h3>

      <p className="t-micro mt-2 flex items-baseline justify-between gap-4">
        <span>{book.author}</span>
        <span className="t-numeral">{book.year}</span>
      </p>
    </article>
  );
}
