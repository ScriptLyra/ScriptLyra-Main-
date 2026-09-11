import type { Book, CoverDesign } from "@/lib/books";

/**
 * Every cover on the list is its own typographic design, drawn in container
 * units so a single composition holds at thumbnail size and at half a screen
 * tall. No photography, no stock art: type, hairlines, and paper.
 *
 * A cover is a picture of a book, so it is hidden from assistive technology —
 * callers are expected to set the title and author in real text alongside it.
 */

/** Hand-set line breaks. Titles are broken where a designer would break them. */
const LINES: Record<CoverDesign, string[] | null> = {
  "silent-city": ["The", "Silent", "City"],
  "grammar-of-rain": ["A Grammar", "of Rain"],
  unsent: ["Everything", "we left", "unsent"],
  cartographer: ["The", "Cartographer’s", "Apology"],
  plain: null,
};

/** A recording of a city that stopped talking: the signal flattens out. */
const SILENCE = [94, 78, 86, 61, 71, 46, 54, 29, 35, 15, 19, 6];

/** Rain, set as type would be: measured, slanted, never random. */
const RAIN: [number, number, number, number][] = [
  [14, 26, 58, 0.3],
  [26, 8, 92, 0.16],
  [38, 44, 40, 0.34],
  [50, 16, 74, 0.2],
  [62, 60, 34, 0.3],
  [74, 4, 108, 0.14],
  [86, 38, 52, 0.32],
  [98, 70, 30, 0.24],
  [110, 12, 86, 0.18],
  [122, 50, 44, 0.3],
  [134, 30, 64, 0.22],
  [146, 6, 98, 0.15],
  [158, 56, 36, 0.3],
  [170, 22, 70, 0.2],
  [182, 46, 46, 0.28],
  [192, 12, 84, 0.16],
];

export default function BookCover({
  book,
  className = "",
  lifted = false,
}: {
  book: Book;
  className?: string;
  /** Adds weight, for covers shown at scale. */
  lifted?: boolean;
}) {
  const lines = LINES[book.design] ?? [book.title];
  const long = lines.some((line) => line.length > 11);

  return (
    <div
      className={`cover cover-${book.ground} ${lifted ? "cover-lifted" : ""} ${className}`.trim()}
      aria-hidden="true"
    >
      {book.design === "silent-city" ? (
        <div className="absolute inset-x-[9cqw] bottom-[9cqw] flex flex-col gap-[2.4cqw]">
          {SILENCE.map((width, i) => (
            <span
              key={i}
              className="block h-px bg-current"
              style={{ width: `${width}%`, opacity: 0.5 - i * 0.032 }}
            />
          ))}
        </div>
      ) : null}

      {book.design === "grammar-of-rain" ? (
        <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full">
          {RAIN.map(([x, y, len, opacity], i) => (
            <line
              key={i}
              x1={x}
              y1={y}
              x2={x + 6}
              y2={y + len}
              stroke="currentColor"
              strokeOpacity={opacity}
              strokeWidth={0.55}
            />
          ))}
        </svg>
      ) : null}

      {book.design === "unsent" ? (
        <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full">
          <line x1="0" y1="96" x2="200" y2="96" stroke="currentColor" strokeOpacity="0.2" strokeWidth="0.55" />
          <line x1="0" y1="96" x2="100" y2="172" stroke="currentColor" strokeOpacity="0.34" strokeWidth="0.55" />
          <line x1="200" y1="96" x2="100" y2="172" stroke="currentColor" strokeOpacity="0.34" strokeWidth="0.55" />
          <line x1="0" y1="96" x2="0" y2="300" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.55" />
          <line x1="200" y1="96" x2="200" y2="300" stroke="currentColor" strokeOpacity="0.12" strokeWidth="0.55" />
        </svg>
      ) : null}

      {book.design === "cartographer" ? (
        <svg viewBox="0 0 200 300" className="absolute inset-0 h-full w-full">
          {[25, 50, 75, 100, 125, 150, 175].map((x) => (
            <line
              key={`v${x}`}
              x1={x}
              y1="0"
              x2={x}
              y2="300"
              stroke="currentColor"
              strokeOpacity={x === 125 ? 0.4 : 0.13}
              strokeWidth={x === 125 ? 0.8 : 0.5}
            />
          ))}
          {[30, 60, 90, 120, 150, 180, 210, 240, 270].map((y) => (
            <line
              key={`h${y}`}
              x1="0"
              y1={y}
              x2="200"
              y2={y}
              stroke="currentColor"
              strokeOpacity={y === 150 ? 0.4 : 0.13}
              strokeWidth={y === 150 ? 0.8 : 0.5}
            />
          ))}
        </svg>
      ) : null}

      <div className="relative z-[1] flex h-full flex-col justify-between p-[8cqw]">
        <p className="text-[3.4cqw] leading-none opacity-60">{book.author}</p>

        <div>
          <p
            className={`font-display leading-[0.94] tracking-[-0.03em] ${
              long ? "text-[10.5cqw]" : "text-[13cqw]"
            }`}
          >
            {lines.map((line, i) => (
              <span key={line + i} className="block">
                {line}
              </span>
            ))}
          </p>
          <span className="mt-[5cqw] block h-px w-[26cqw] bg-current opacity-45" />
          <p className="mt-[4cqw] text-[3.2cqw] leading-none opacity-60">{book.genre}</p>
        </div>
      </div>

      <span className="cover-sheen" />
    </div>
  );
}
