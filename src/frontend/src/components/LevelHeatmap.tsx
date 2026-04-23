import { cn } from "@/lib/utils";
import { QuestionStatus } from "../backend";
import type { QuestionRecord, TemplateLevel } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface LevelAccuracy {
  level: TemplateLevel;
  correct: number;
  incorrect: number;
  revisit: number;
  total: number;
  /** Accuracy = correct / (correct + incorrect + revisit), null if denominator is 0 */
  accuracy: number | null;
}

interface LevelHeatmapProps {
  levels: TemplateLevel[];
  levelQuestions: number[][];
  recordMap: Map<number, QuestionRecord>;
  className?: string;
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeLevelAccuracy(
  level: TemplateLevel,
  questions: number[],
  recordMap: Map<number, QuestionRecord>,
): LevelAccuracy {
  let correct = 0;
  let incorrect = 0;
  let revisit = 0;

  for (const q of questions) {
    const status = recordMap.get(q)?.status ?? QuestionStatus.Unattempted;
    if (status === QuestionStatus.Correct) correct++;
    else if (status === QuestionStatus.Incorrect) incorrect++;
    else if (status === QuestionStatus.Revisit) revisit++;
  }

  const denominator = correct + incorrect + revisit;
  const accuracy = denominator > 0 ? (correct / denominator) * 100 : null;

  return {
    level,
    correct,
    incorrect,
    revisit,
    total: questions.length,
    accuracy,
  };
}

/** Returns Tailwind classes for the heat card background based on accuracy */
function heatClass(accuracy: number | null): string {
  if (accuracy === null) return "bg-secondary border-border";
  if (accuracy >= 80)
    return "bg-[oklch(0.25_0.08_132)] border-[oklch(0.4_0.16_132)]";
  if (accuracy >= 50)
    return "bg-[oklch(0.25_0.08_88)] border-[oklch(0.4_0.18_88)]";
  return "bg-[oklch(0.25_0.08_18)] border-[oklch(0.4_0.14_18)]";
}

function heatTextClass(accuracy: number | null): string {
  if (accuracy === null) return "text-muted-foreground";
  if (accuracy >= 80) return "text-status-solved";
  if (accuracy >= 50) return "text-status-revisit";
  return "text-status-incorrect";
}

// ─── Component ───────────────────────────────────────────────────────────────

export function LevelHeatmap({
  levels,
  levelQuestions,
  recordMap,
  className,
}: LevelHeatmapProps) {
  if (levels.length === 0) return null;

  const accuracies = levels.map((level, idx) =>
    computeLevelAccuracy(level, levelQuestions[idx] ?? [], recordMap),
  );

  return (
    <div className={cn("space-y-2", className)} data-ocid="heatmap.section">
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-display px-0.5">
        Level Accuracy Heatmap
      </h3>
      <div
        className="grid gap-2"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))" }}
        data-ocid="heatmap.grid"
      >
        {accuracies.map(({ level, correct, total, accuracy }, idx) => (
          <div
            key={String(level.id)}
            data-ocid={`heatmap.card.${idx + 1}`}
            className={cn(
              "rounded-xl border px-3 py-2.5 min-h-[60px] flex flex-col justify-between",
              "transition-smooth",
              heatClass(accuracy),
            )}
          >
            {/* Level name */}
            <span
              className="font-display font-semibold text-xs text-foreground truncate leading-tight"
              title={level.name}
            >
              {level.name}
            </span>

            {/* Range */}
            <span className="font-mono text-[10px] text-muted-foreground mt-0.5">
              Q{Number(level.startQuestion)}–Q{Number(level.endQuestion)}
            </span>

            {/* Accuracy + fraction */}
            <div className="flex items-end justify-between mt-2 gap-1">
              <span
                className={cn(
                  "font-mono font-bold text-lg leading-none",
                  heatTextClass(accuracy),
                )}
              >
                {accuracy !== null ? `${Math.round(accuracy)}%` : "—"}
              </span>
              <span className="font-mono text-[10px] text-muted-foreground shrink-0">
                {correct}/{total}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div
        className="flex items-center gap-3 flex-wrap px-0.5 pt-0.5"
        aria-label="Heatmap legend"
      >
        {[
          { label: "≥80% accurate", dot: "bg-status-solved" },
          {
            label: "50–79%",
            dot: "text-status-revisit bg-[oklch(0.35_0.1_88)]",
          },
          { label: "<50%", dot: "bg-status-incorrect" },
          { label: "No attempts", dot: "bg-secondary" },
        ].map(({ label, dot }) => (
          <span
            key={label}
            className="flex items-center gap-1.5 text-[10px] text-muted-foreground font-body"
          >
            <span className={cn("w-2 h-2 rounded-sm shrink-0", dot)} />
            {label}
          </span>
        ))}
      </div>
    </div>
  );
}
