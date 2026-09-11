/**
 * A folio: the numeral and running head a book carries in its outer margin.
 * It stands in for the tracked-out capital label that would otherwise sit above
 * every section — and unlike that label it says something true, namely where in
 * the sequence you are.
 */
export default function Folio({
  n,
  head,
  tone = "ink",
  className = "",
}: {
  n: string;
  head: string;
  tone?: "ink" | "paper";
  className?: string;
}) {
  return (
    <p
      className={`t-folio flex items-baseline gap-3 ${tone === "paper" ? "text-paper/50" : ""} ${className}`.trim()}
    >
      <span aria-hidden="true">{n}</span>
      <span className="italic">{head}</span>
    </p>
  );
}
