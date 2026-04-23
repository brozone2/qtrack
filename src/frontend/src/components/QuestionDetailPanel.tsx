import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useCallback, useEffect, useRef, useState } from "react";
import { MistakeTag, QuestionStatus } from "../backend";
import type { QuestionRecord, TemplateId, TemplateLevel } from "../types";
import { statusLabel } from "../utils/questionStatus";

interface QuestionDetailPanelProps {
  templateId: TemplateId;
  questionNumber: number;
  record: QuestionRecord | null;
  levels: TemplateLevel[];
  onClose: () => void;
  onSave: (updated: QuestionRecord) => void;
}

const STATUS_BUTTONS: {
  status: QuestionStatus;
  label: string;
  colorClass: string;
}[] = [
  {
    status: QuestionStatus.Unattempted,
    label: "Unseen",
    colorClass: "bg-status-unattempted",
  },
  {
    status: QuestionStatus.Correct,
    label: "Correct",
    colorClass: "bg-status-solved",
  },
  {
    status: QuestionStatus.Incorrect,
    label: "Wrong",
    colorClass: "bg-status-incorrect",
  },
  {
    status: QuestionStatus.Revisit,
    label: "Revisit",
    colorClass: "bg-status-revisit",
  },
];

const MISTAKE_TAGS: { tag: MistakeTag; label: string }[] = [
  { tag: MistakeTag.ConceptError, label: "Concept Error" },
  { tag: MistakeTag.AlgebraMistake, label: "Algebra Mistake" },
  { tag: MistakeTag.SillyMistake, label: "Silly Mistake" },
  { tag: MistakeTag.Guessed, label: "Guessed" },
  { tag: MistakeTag.TimeIssue, label: "Time Issue" },
];

function formatDate(ts: bigint | undefined): string {
  if (!ts) return "";
  const ms = Number(ts);
  const d = new Date(ms);
  return d.toISOString().slice(0, 10);
}

function parseDateToTimestamp(dateStr: string): bigint | null {
  if (!dateStr) return null;
  const ms = new Date(dateStr).getTime();
  return Number.isNaN(ms) ? null : BigInt(ms);
}

export function QuestionDetailPanel({
  templateId,
  questionNumber,
  record,
  levels: _levels,
  onClose,
  onSave,
}: QuestionDetailPanelProps) {
  const [status, setStatus] = useState<QuestionStatus>(
    record?.status ?? QuestionStatus.Unattempted,
  );
  const [notes, setNotes] = useState(record?.notes ?? "");
  const [mistakeTags, setMistakeTags] = useState<MistakeTag[]>(
    record?.mistakeTags ?? [],
  );
  const [difficulty, setDifficulty] = useState<number>(
    record?.difficultyRating != null ? Number(record.difficultyRating) : 0,
  );
  const [markedForRedo, setMarkedForRedo] = useState(
    record?.markedForRedo ?? false,
  );
  const [lastAttemptedAt, setLastAttemptedAt] = useState<string>(
    formatDate(record?.lastAttemptedAt),
  );
  const panelRef = useRef<HTMLDivElement>(null);

  // Focus trap & escape key
  useEffect(() => {
    const el = panelRef.current;
    if (el) el.focus();
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const buildRecord = useCallback(
    (overrides: Partial<QuestionRecord> = {}): QuestionRecord => {
      const now = BigInt(Date.now());
      const base: QuestionRecord = {
        templateId,
        questionNumber: BigInt(questionNumber),
        status,
        notes: notes || undefined,
        mistakeTags,
        difficultyRating: difficulty > 0 ? BigInt(difficulty) : undefined,
        markedForRedo,
        lastAttemptedAt: lastAttemptedAt
          ? (parseDateToTimestamp(lastAttemptedAt) ?? undefined)
          : undefined,
      };
      const result = { ...base, ...overrides };
      // Auto-set lastAttemptedAt on first status change away from unattempted
      if (
        !result.lastAttemptedAt &&
        result.status !== QuestionStatus.Unattempted
      ) {
        result.lastAttemptedAt = now;
      }
      return result;
    },
    [
      templateId,
      questionNumber,
      status,
      notes,
      mistakeTags,
      difficulty,
      markedForRedo,
      lastAttemptedAt,
    ],
  );

  const handleStatusChange = async (newStatus: QuestionStatus) => {
    setStatus(newStatus);
    // Auto-set date on first status change
    if (!lastAttemptedAt && newStatus !== QuestionStatus.Unattempted) {
      setLastAttemptedAt(new Date().toISOString().slice(0, 10));
    }
    const updated = buildRecord({ status: newStatus });
    onSave(updated);
  };

  const handleNotesBlur = () => {
    const updated = buildRecord();
    onSave(updated);
  };

  const handleTagToggle = (tag: MistakeTag) => {
    const next = mistakeTags.includes(tag)
      ? mistakeTags.filter((t) => t !== tag)
      : [...mistakeTags, tag];
    setMistakeTags(next);
    const updated = buildRecord({ mistakeTags: next });
    onSave(updated);
  };

  const handleDifficulty = (star: number) => {
    const next = difficulty === star ? 0 : star;
    setDifficulty(next);
    const updated = buildRecord({
      difficultyRating: next > 0 ? BigInt(next) : undefined,
    });
    onSave(updated);
  };

  const handleRedoToggle = (val: boolean) => {
    setMarkedForRedo(val);
    const updated = buildRecord({ markedForRedo: val });
    onSave(updated);
  };

  const handleDateChange = (val: string) => {
    setLastAttemptedAt(val);
    const ts = parseDateToTimestamp(val);
    const updated = buildRecord({ lastAttemptedAt: ts ?? undefined });
    onSave(updated);
  };

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        className="fixed inset-0 bg-background/60 backdrop-blur-sm z-40 md:bg-transparent md:backdrop-blur-none cursor-default"
        onClick={onClose}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") onClose();
        }}
        aria-label="Close detail panel"
        tabIndex={-1}
        data-ocid="question_detail.backdrop"
      />

      {/* Panel */}
      <div
        ref={panelRef}
        tabIndex={-1}
        aria-modal
        aria-label={`Question ${questionNumber} detail`}
        data-ocid="question_detail.dialog"
        className={cn(
          "fixed z-50 bg-card flex flex-col outline-none",
          "shadow-elevated border-border",
          // Mobile: full-screen slide up
          "inset-x-0 bottom-0 rounded-t-2xl border-t max-h-[92dvh]",
          // Desktop: right-side drawer
          "md:inset-y-0 md:right-0 md:left-auto md:top-0 md:bottom-0 md:w-[380px]",
          "md:rounded-none md:border-t-0 md:border-l md:max-h-full",
          "animate-in slide-in-from-bottom duration-300 md:slide-in-from-right",
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
          <div className="flex items-center gap-3">
            <span className="font-display font-bold text-lg text-foreground">
              Q{questionNumber}
            </span>
            <span
              className={cn(
                "text-xs font-body px-2 py-0.5 rounded-full font-medium",
                STATUS_BUTTONS.find((b) => b.status === status)?.colorClass,
                "text-foreground",
              )}
            >
              {statusLabel(status)}
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close panel"
            data-ocid="question_detail.close_button"
            className="w-8 h-8 flex items-center justify-center rounded-full text-muted-foreground hover:text-foreground hover:bg-secondary transition-smooth"
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto px-5 py-4 space-y-6">
          {/* Status selector */}
          <section
            aria-label="Status"
            data-ocid="question_detail.status.section"
          >
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2">
              Status
            </p>
            <div className="grid grid-cols-2 gap-2">
              {STATUS_BUTTONS.map((btn) => (
                <button
                  key={btn.status}
                  type="button"
                  onClick={() => handleStatusChange(btn.status)}
                  data-ocid={`question_detail.status_${btn.status.toLowerCase()}_button`}
                  aria-pressed={status === btn.status}
                  className={cn(
                    "py-3 rounded-lg text-sm font-body font-semibold transition-smooth",
                    "min-h-[48px] select-none",
                    btn.colorClass,
                    "text-foreground",
                    status === btn.status
                      ? "ring-2 ring-primary ring-offset-1 ring-offset-card"
                      : "opacity-60 hover:opacity-90",
                  )}
                >
                  {btn.label}
                </button>
              ))}
            </div>
          </section>

          {/* Notes */}
          <section aria-label="Notes" data-ocid="question_detail.notes.section">
            <Label className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2 block">
              Notes
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              onBlur={handleNotesBlur}
              placeholder="Add notes about this question…"
              data-ocid="question_detail.notes.textarea"
              className="min-h-[80px] resize-none bg-secondary border-input text-sm font-body"
              rows={3}
            />
          </section>

          {/* Mistake Tags */}
          <section
            aria-label="Mistake Tags"
            data-ocid="question_detail.mistake_tags.section"
          >
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2">
              Mistake Tags
            </p>
            <div className="flex flex-col gap-2">
              {MISTAKE_TAGS.map(({ tag, label }) => {
                const checked = mistakeTags.includes(tag);
                return (
                  <label
                    key={tag}
                    className={cn(
                      "flex items-center gap-3 px-3 py-2.5 rounded-lg cursor-pointer transition-smooth",
                      "min-h-[44px] select-none",
                      checked ? "bg-secondary/80" : "hover:bg-secondary/40",
                    )}
                    data-ocid={`question_detail.tag_${tag.toLowerCase()}_checkbox`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => handleTagToggle(tag)}
                      className="w-4 h-4 rounded border-input accent-primary"
                    />
                    <span className="text-sm font-body text-foreground">
                      {label}
                    </span>
                  </label>
                );
              })}
            </div>
          </section>

          {/* Difficulty */}
          <section
            aria-label="Difficulty"
            data-ocid="question_detail.difficulty.section"
          >
            <p className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2">
              Difficulty
            </p>
            <div
              className="flex items-center gap-1.5"
              role="radiogroup"
              aria-label="Difficulty rating"
            >
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => handleDifficulty(star)}
                  aria-label={`${star} star${star > 1 ? "s" : ""}`}
                  aria-pressed={difficulty >= star}
                  data-ocid={`question_detail.difficulty_star_${star}`}
                  className={cn(
                    "text-2xl transition-smooth min-h-[44px] min-w-[44px] flex items-center justify-center rounded",
                    "hover:scale-110 active:scale-95",
                    difficulty >= star
                      ? "text-status-revisit"
                      : "text-muted-foreground/30",
                  )}
                >
                  ★
                </button>
              ))}
            </div>
          </section>

          {/* Mark for Redo */}
          <section
            aria-label="Mark for Redo"
            data-ocid="question_detail.redo.section"
          >
            <div className="flex items-center justify-between py-1">
              <Label
                htmlFor="redo-switch"
                className="text-sm font-body text-foreground cursor-pointer"
              >
                Mark for Redo
              </Label>
              <Switch
                id="redo-switch"
                checked={markedForRedo}
                onCheckedChange={handleRedoToggle}
                data-ocid="question_detail.redo.switch"
                aria-label="Mark question for redo"
              />
            </div>
          </section>

          {/* Last Attempted */}
          <section
            aria-label="Last Attempted"
            data-ocid="question_detail.last_attempted.section"
          >
            <Label
              htmlFor="last-attempted"
              className="text-xs font-body text-muted-foreground uppercase tracking-wide mb-2 block"
            >
              Last Attempted
            </Label>
            <input
              id="last-attempted"
              type="date"
              value={lastAttemptedAt}
              onChange={(e) => handleDateChange(e.target.value)}
              data-ocid="question_detail.last_attempted.input"
              className={cn(
                "w-full px-3 py-2 rounded-lg bg-secondary border border-input",
                "text-sm font-mono text-foreground min-h-[44px]",
                "focus:outline-none focus:ring-2 focus:ring-ring transition-smooth",
              )}
            />
          </section>
        </div>
      </div>
    </>
  );
}
