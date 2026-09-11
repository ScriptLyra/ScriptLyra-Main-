import Link from "next/link";
import Folio from "./Folio";
import { MaskedLines } from "./Motion";

type Props = {
  /** Homepage passages carry a folio; inside pages pass null to drop it. */
  folio?: { n: string; head: string } | null;
  /** Hand-broken lines: the heading is set, not left to wrap. */
  lines: string[];
  id?: string;
  lead?: string;
  link?: { label: string; href: string };
  tone?: "ink" | "paper";
  size?: "l" | "m";
  className?: string;
};

/**
 * The opening of a passage: folio, then the statement, set line by line as it
 * comes into view. Sections place their own crease above this.
 */
export default function SectionHeading({
  folio,
  lines,
  id,
  lead,
  link,
  tone = "ink",
  size = "l",
  className = "",
}: Props) {
  const onInk = tone === "paper";

  return (
    <div className={className}>
      {folio ? <Folio n={folio.n} head={folio.head} tone={tone} /> : null}

      <div className="mt-9 grid gap-x-10 gap-y-8 lg:grid-cols-12">
        <h2
          id={id}
          className={`${size === "l" ? "t-display-l" : "t-display-m"} max-w-[22ch] lg:col-span-7`}
        >
          <MaskedLines lines={lines} onScroll />
        </h2>

        {lead || link ? (
          <div className="lg:col-span-4 lg:col-start-9 lg:self-end">
            {lead ? (
              <p className={`t-body ${onInk ? "text-paper/70" : "text-graphite"}`}>{lead}</p>
            ) : null}
            {link ? (
              <Link
                href={link.href}
                className={`link-rule mt-6 inline-block text-[0.9375rem] ${
                  onInk ? "text-paper" : "text-ink"
                }`}
              >
                {link.label}
              </Link>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}
