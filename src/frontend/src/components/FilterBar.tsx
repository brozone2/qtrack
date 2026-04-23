import { cn } from "@/lib/utils";
import type { StatusFilter } from "../types";

interface FilterBarProps {
  active: StatusFilter;
  onChange: (filter: StatusFilter) => void;
  redoCount?: number;
}

const FILTERS: { key: StatusFilter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "correct", label: "Solved" },
  { key: "incorrect", label: "Wrong" },
  { key: "revisit", label: "Revisit" },
  { key: "unattempted", label: "Unseen" },
  { key: "redo", label: "Redo" },
];

export function FilterBar({ active, onChange, redoCount }: FilterBarProps) {
  return (
    <fieldset className="flex items-center gap-1.5 flex-wrap border-0 p-0 m-0">
      <legend className="sr-only">Filter questions</legend>
      {FILTERS.map((f) => (
        <button
          key={f.key}
          type="button"
          onClick={() => onChange(f.key)}
          data-ocid={`filter.${f.key}_tab`}
          aria-pressed={active === f.key}
          className={cn(
            "px-3 py-1 rounded-full text-xs font-body font-medium transition-smooth",
            "min-h-[44px] select-none whitespace-nowrap",
            active === f.key
              ? "bg-primary text-primary-foreground"
              : "bg-secondary text-muted-foreground hover:text-foreground hover:bg-secondary/80",
          )}
        >
          {f.label}
          {f.key === "redo" && redoCount != null && redoCount > 0 && (
            <span className="ml-1 font-mono">{redoCount}</span>
          )}
        </button>
      ))}
    </fieldset>
  );
}
