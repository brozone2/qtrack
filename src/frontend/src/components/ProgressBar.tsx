import { cn } from "@/lib/utils";

interface ProgressBarProps {
  label: string;
  count: number;
  total: number;
  /** Optional accent color class for the filled portion (defaults to bg-primary) */
  colorClass?: string;
  className?: string;
}

export function ProgressBar({
  label,
  count,
  total,
  colorClass = "bg-primary",
  className,
}: ProgressBarProps) {
  const pct = total === 0 ? 0 : Math.round((count / total) * 100);

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center justify-between text-xs font-body">
        <span className="text-muted-foreground truncate">{label}</span>
        <span className="font-mono text-foreground shrink-0 ml-2">
          {count}/{total}
          <span className="text-muted-foreground ml-1">({pct}%)</span>
        </span>
      </div>
      <div
        className="h-1.5 rounded-full bg-secondary overflow-hidden"
        aria-label={`${label}: ${pct}%`}
      >
        <div
          className={cn(
            "h-full rounded-full transition-all duration-500",
            colorClass,
          )}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
