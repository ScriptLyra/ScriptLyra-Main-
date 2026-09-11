"use client";

/**
 * A filter row, set like the head of a catalogue column: the label, then the
 * choices. The current choice is underlined rather than boxed — no pills, no
 * dropdowns, nothing that needs opening.
 */
export default function FilterBar({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string;
  onChange: (next: string) => void;
}) {
  return (
    <div className="border-rule flex flex-wrap items-baseline gap-x-7 gap-y-3 border-b py-4">
      <span className="t-micro w-full sm:w-24">{label}</span>

      {options.map((option) => {
        const active = option === value;

        return (
          <button
            key={option}
            type="button"
            aria-pressed={active}
            onClick={() => onChange(option)}
            className={`cursor-pointer pb-0.5 text-[0.9375rem] transition-colors duration-500 ${
              active
                ? "border-ink text-ink border-b"
                : "text-graphite hover:text-ink border-b border-transparent"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
