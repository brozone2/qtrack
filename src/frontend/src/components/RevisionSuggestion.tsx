import { cn } from "@/lib/utils";
import { MistakeTag, QuestionStatus } from "../backend";
import type { QuestionRecord } from "../types";

// ─── Types ───────────────────────────────────────────────────────────────────

interface TagFrequency {
  tag: MistakeTag;
  count: number;
}

interface RevisionSuggestionProps {
  records: QuestionRecord[];
  className?: string;
}

// ─── Tip map ─────────────────────────────────────────────────────────────────

const TAG_LABELS: Record<string, string> = {
  [MistakeTag.ConceptError]: "Concept Error",
  [MistakeTag.AlgebraMistake]: "Algebra Mistake",
  [MistakeTag.SillyMistake]: "Silly Mistake",
  [MistakeTag.Guessed]: "Guessed",
  [MistakeTag.TimeIssue]: "Time Issue",
};

const TAG_TIPS: Record<string, string> = {
  [MistakeTag.ConceptError]: "Review core theory",
  [MistakeTag.AlgebraMistake]: "Practice algebra fundamentals",
  [MistakeTag.SillyMistake]: "Slow down and double-check your work",
  [MistakeTag.Guessed]: "Revisit and solve properly",
  [MistakeTag.TimeIssue]: "Work on speed with timed practice",
};

const TAG_ICON: Record<string, string> = {
  [MistakeTag.ConceptError]: "📖",
  [MistakeTag.AlgebraMistake]: "🔢",
  [MistakeTag.SillyMistake]: "🎯",
  [MistakeTag.Guessed]: "🎲",
  [MistakeTag.TimeIssue]: "⏱",
};

// ─── Helpers ─────────────────────────────────────────────────────────────────

function computeTopTags(records: QuestionRecord[]): TagFrequency[] {
  const freq = new Map<string, number>();

  for (const r of records) {
    const isWeak =
      r.status === QuestionStatus.Incorrect ||
      r.status === QuestionStatus.Revisit;
    if (!isWeak) continue;
    for (const tag of r.mistakeTags) {
      freq.set(String(tag), (freq.get(String(tag)) ?? 0) + 1);
    }
  }

  return Array.from(freq.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3)
    .map(([tag, count]) => ({ tag: tag as MistakeTag, count }));
}

// ─── Component ───────────────────────────────────────────────────────────────

export function RevisionSuggestion({
  records,
  className,
}: RevisionSuggestionProps) {
  const topTags = computeTopTags(records);

  return (
    <div
      className={cn("space-y-2", className)}
      data-ocid="revision_suggestion.section"
    >
      <h3 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider font-display px-0.5">
        Revision Suggestions
      </h3>

      <div className="bg-card rounded-xl border border-border p-3 space-y-2.5">
        {topTags.length === 0 ? (
          <p
            className="text-sm text-muted-foreground font-body py-1 text-center"
            data-ocid="revision_suggestion.empty_state"
          >
            🎉 No mistakes yet — keep it up!
          </p>
        ) : (
          topTags.map(({ tag, count }, idx) => {
            const label = TAG_LABELS[String(tag)] ?? String(tag);
            const tip = TAG_TIPS[String(tag)] ?? "";
            const icon = TAG_ICON[String(tag)] ?? "•";

            return (
              <div
                key={String(tag)}
                className={cn(
                  "flex items-start gap-3 py-1",
                  idx !== topTags.length - 1 && "border-b border-border pb-2.5",
                )}
                data-ocid={`revision_suggestion.item.${idx + 1}`}
              >
                {/* Icon */}
                <span className="text-base shrink-0 mt-0.5" aria-hidden="true">
                  {icon}
                </span>

                {/* Content */}
                <div className="flex-1 min-w-0 space-y-0.5">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span
                      className={cn(
                        "inline-flex items-center px-1.5 py-0.5 rounded-md",
                        "text-[10px] font-semibold font-display uppercase tracking-wide",
                        "bg-secondary text-secondary-foreground border border-border",
                      )}
                    >
                      {label}
                    </span>
                    <span className="text-[10px] font-mono text-muted-foreground">
                      {count}×
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground font-body leading-snug">
                    {tip}
                  </p>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
