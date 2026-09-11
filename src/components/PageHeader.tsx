import { MaskedLines } from "./Motion";

/**
 * How every page other than the homepage opens: a running head, a crease, and
 * the title set line by line. The homepage carries folios because it reads as
 * one continuous book; the inside pages carry running heads instead.
 */
export default function PageHeader({
  head,
  lines,
  lead,
  meta,
}: {
  head: string;
  lines: string[];
  lead?: string;
  /** Right-hand side of the running head: an extent, a count, a date. */
  meta?: string;
}) {
  return (
    <header className="grain-paper relative" data-nav-tone="ink">
      <div className="above-grain shell pt-[calc(var(--nav-h)+4rem)] pb-16 sm:pt-[calc(var(--nav-h)+6.5rem)] sm:pb-20">
        <p className="t-folio flex items-baseline justify-between gap-6">
          <span className="italic">{head}</span>
          {meta ? <span>{meta}</span> : null}
        </p>

        <hr className="crease mt-6" />

        <h1 className="t-display-l mt-10 max-w-[22ch]">
          <MaskedLines lines={lines} delay={0.1} />
        </h1>

        {lead ? <p className="t-lead text-graphite mt-8">{lead}</p> : null}
      </div>
    </header>
  );
}
