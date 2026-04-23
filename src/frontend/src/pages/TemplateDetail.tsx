import { cn } from "@/lib/utils";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { MistakeTag, QuestionStatus } from "../backend";
import { EmptyState } from "../components/EmptyState";
import { FilterBar } from "../components/FilterBar";
import { LevelHeatmap } from "../components/LevelHeatmap";
import { LoadingSpinner } from "../components/LoadingSpinner";
import { ProgressBar } from "../components/ProgressBar";
import { QuestionCell } from "../components/QuestionCell";
import { QuestionDetailPanel } from "../components/QuestionDetailPanel";
import { RevisionSuggestion } from "../components/RevisionSuggestion";
import { useBackend } from "../hooks/useBackend";
import type { QuestionRecord, StatusFilter, TemplateLevel } from "../types";

// ─── helpers ────────────────────────────────────────────────────────────────

function matchesFilter(
  record: QuestionRecord | undefined,
  filter: StatusFilter,
  redoSet: Set<number>,
): boolean {
  if (filter === "all") return true;
  if (filter === "redo")
    return redoSet.has(record ? Number(record.questionNumber) : -1);
  if (!record) return filter === "unattempted";
  if (filter === "correct") return record.status === QuestionStatus.Correct;
  if (filter === "incorrect") return record.status === QuestionStatus.Incorrect;
  if (filter === "revisit") return record.status === QuestionStatus.Revisit;
  if (filter === "unattempted")
    return record.status === QuestionStatus.Unattempted;
  return true;
}

function matchesTagFilter(
  record: QuestionRecord | undefined,
  tag: MistakeTag | "none",
): boolean {
  if (tag === "none") return true;
  if (!record) return false;
  return record.mistakeTags.includes(tag);
}

// ─── Inline-editable template name ─────────────────────────────────────────

interface EditableNameProps {
  name: string;
  onSave: (next: string) => void;
}

function EditableName({ name, onSave }: EditableNameProps) {
  const [editing, setEditing] = useState(false);
  const [value, setValue] = useState(name);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editing) inputRef.current?.focus();
  }, [editing]);

  const commit = () => {
    setEditing(false);
    const trimmed = value.trim();
    if (trimmed && trimmed !== name) onSave(trimmed);
    else setValue(name);
  };

  if (editing) {
    return (
      <input
        ref={inputRef}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setValue(name);
            setEditing(false);
          }
        }}
        data-ocid="template_detail.name.input"
        aria-label="Template name"
        className={cn(
          "font-display font-bold text-xl bg-transparent border-b border-primary",
          "focus:outline-none text-foreground w-full max-w-xs",
        )}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setEditing(true)}
      title="Click to rename"
      data-ocid="template_detail.name.edit_button"
      className="font-display font-bold text-xl text-foreground hover:text-primary transition-smooth text-left"
    >
      {name}
    </button>
  );
}

// ─── Level section ──────────────────────────────────────────────────────────

interface LevelSectionProps {
  level: TemplateLevel;
  questions: number[];
  recordMap: Map<number, QuestionRecord>;
  redoSet: Set<number>;
  filter: StatusFilter;
  tagFilter: MistakeTag | "none";
  selectedQ: number | null;
  onTap: (q: number) => void;
  sectionIndex: number;
}

function LevelSection({
  level,
  questions,
  recordMap,
  redoSet,
  filter,
  tagFilter,
  selectedQ,
  onTap,
  sectionIndex,
}: LevelSectionProps) {
  const [collapsed, setCollapsed] = useState(false);

  const visibleQs = questions.filter((q) => {
    const rec = recordMap.get(q);
    return (
      matchesFilter(rec, filter, redoSet) && matchesTagFilter(rec, tagFilter)
    );
  });

  const total = questions.length;
  const correct = questions.filter(
    (q) => recordMap.get(q)?.status === QuestionStatus.Correct,
  ).length;

  if (filter !== "all" && visibleQs.length === 0) return null;

  return (
    <section
      data-ocid={`template_detail.level.${sectionIndex}`}
      className="mb-4"
    >
      {/* Level header */}
      <button
        type="button"
        onClick={() => setCollapsed((c) => !c)}
        data-ocid={`template_detail.level_toggle.${sectionIndex}`}
        aria-expanded={!collapsed}
        className={cn(
          "w-full flex items-center justify-between gap-3 px-3 py-2 rounded-lg",
          "bg-secondary/50 hover:bg-secondary/80 transition-smooth",
          "text-left min-h-[44px] mb-2",
        )}
      >
        <div className="flex items-center gap-2 min-w-0">
          <span className="font-display font-semibold text-sm text-foreground truncate">
            {level.name}
          </span>
          <span className="text-xs text-muted-foreground font-mono shrink-0">
            Q{Number(level.startQuestion)}–Q{Number(level.endQuestion)}
          </span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-xs font-mono text-muted-foreground">
            {correct}/{total}
          </span>
          <span
            className={cn(
              "text-muted-foreground text-xs transition-smooth",
              collapsed && "rotate-180",
            )}
            style={{ display: "inline-block" }}
          >
            ▾
          </span>
        </div>
      </button>

      {/* Per-level progress */}
      {!collapsed && (
        <ProgressBar
          label=""
          count={correct}
          total={total}
          colorClass="bg-status-solved"
          className="px-3 mb-2"
        />
      )}

      {/* Grid */}
      {!collapsed && (
        <div
          className="grid gap-1.5"
          style={{
            gridTemplateColumns: "repeat(auto-fill, minmax(48px, 1fr))",
          }}
          data-ocid={`template_detail.grid.${sectionIndex}`}
        >
          {visibleQs.map((q, idx) => {
            const rec = recordMap.get(q);
            const status = rec?.status ?? QuestionStatus.Unattempted;
            return (
              <QuestionCell
                key={q}
                questionNumber={q}
                status={status}
                isSelected={selectedQ === q}
                isMarkedForRedo={redoSet.has(q)}
                onTap={onTap}
                data-ocid={`template_detail.cell.${idx + 1}`}
              />
            );
          })}
          {filter !== "all" && visibleQs.length === 0 && (
            <p className="col-span-full text-xs text-muted-foreground py-4 text-center font-body">
              No questions match this filter in this level.
            </p>
          )}
        </div>
      )}
    </section>
  );
}

// ─── Main page ───────────────────────────────────────────────────────────────

export default function TemplateDetail() {
  const { id } = useParams({ from: "/template/$id" });
  const navigate = useNavigate();
  const { actor, isFetching } = useBackend();
  const queryClient = useQueryClient();

  const [filter, setFilter] = useState<StatusFilter>("all");
  const [tagFilter, setTagFilter] = useState<MistakeTag | "none">("none");
  const [selectedQ, setSelectedQ] = useState<number | null>(null);

  // Optimistic status overrides: questionNumber → status
  const [optimistic, setOptimistic] = useState<Map<number, QuestionStatus>>(
    new Map(),
  );

  const templateId = BigInt(id ?? "0");

  // ── Data fetching ──────────────────────────────────────────────────────────
  const { data: templates } = useQuery({
    queryKey: ["templates"],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplates();
    },
    enabled: !!actor && !isFetching,
  });

  const template = templates?.find((t) => t.id === templateId);

  const { data: levels = [], isLoading: levelsLoading } = useQuery({
    queryKey: ["levels", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateLevels(templateId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: records = [], isLoading: recordsLoading } = useQuery({
    queryKey: ["records", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateRecords(templateId);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: redoRecords = [] } = useQuery({
    queryKey: ["redo", id],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getRedoMarkedQuestions(templateId);
    },
    enabled: !!actor && !isFetching,
  });

  // ── Derived data ───────────────────────────────────────────────────────────
  const recordMap = new Map<number, QuestionRecord>(
    records.map((r) => [Number(r.questionNumber), r]),
  );

  // Apply optimistic overrides
  for (const [qNum, status] of optimistic.entries()) {
    const existing = recordMap.get(qNum);
    if (existing) {
      recordMap.set(qNum, { ...existing, status });
    } else {
      recordMap.set(qNum, {
        templateId,
        questionNumber: BigInt(qNum),
        status,
        mistakeTags: [],
        markedForRedo: false,
      });
    }
  }

  const redoSet = new Set<number>(
    redoRecords.map((r) => Number(r.questionNumber)),
  );

  // Sorted levels by order
  const sortedLevels = [...levels].sort(
    (a, b) => Number(a.order) - Number(b.order),
  );

  // Questions per level
  const levelQuestions = sortedLevels.map((lvl) => {
    const start = Number(lvl.startQuestion);
    const end = Number(lvl.endQuestion);
    const qs: number[] = [];
    for (let q = start; q <= end; q++) qs.push(q);
    return qs;
  });

  const allQuestions = levelQuestions.flat();
  const totalQ = allQuestions.length;
  const attemptedQ = allQuestions.filter(
    (q) =>
      (recordMap.get(q)?.status ?? QuestionStatus.Unattempted) !==
      QuestionStatus.Unattempted,
  ).length;
  const correctQ = allQuestions.filter(
    (q) => recordMap.get(q)?.status === QuestionStatus.Correct,
  ).length;
  const incorrectQ = allQuestions.filter(
    (q) => recordMap.get(q)?.status === QuestionStatus.Incorrect,
  ).length;
  const redoCount = redoSet.size;

  // ── Mutations ──────────────────────────────────────────────────────────────
  const setStatusMutation = useMutation({
    mutationFn: async ({
      qNum,
      status,
    }: { qNum: number; status: QuestionStatus }) => {
      if (!actor) throw new Error("No actor");
      return actor.setQuestionStatus(templateId, BigInt(qNum), status);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["records", id] });
      queryClient.invalidateQueries({ queryKey: ["redo", id] });
    },
  });

  const updateDetailMutation = useMutation({
    mutationFn: async (r: QuestionRecord) => {
      if (!actor) throw new Error("No actor");
      return actor.updateQuestionDetail(
        r.templateId,
        r.questionNumber,
        r.notes ?? null,
        r.mistakeTags,
        r.difficultyRating ?? null,
        r.markedForRedo,
        r.lastAttemptedAt ?? null,
      );
    },
    onSuccess: (updated) => {
      queryClient.setQueryData(
        ["records", id],
        (old: QuestionRecord[] | undefined) => {
          if (!old) return [updated];
          const idx = old.findIndex(
            (r) => r.questionNumber === updated.questionNumber,
          );
          if (idx === -1) return [...old, updated];
          const next = [...old];
          next[idx] = updated;
          return next;
        },
      );
      queryClient.invalidateQueries({ queryKey: ["redo", id] });
    },
  });

  const updateNameMutation = useMutation({
    mutationFn: async (name: string) => {
      if (!actor) throw new Error("No actor");
      return actor.updateTemplate(templateId, name);
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["templates"] }),
  });

  // ── Handlers ───────────────────────────────────────────────────────────────
  const handleCellTap = useCallback((qNum: number) => {
    setSelectedQ((prev) => (prev === qNum ? null : qNum));
  }, []);

  const handlePanelSave = useCallback(
    (updated: QuestionRecord) => {
      const qNum = Number(updated.questionNumber);
      // Optimistic status update
      setOptimistic((prev) => {
        const next = new Map(prev);
        next.set(qNum, updated.status);
        return next;
      });
      // Fire status API
      setStatusMutation.mutate({ qNum, status: updated.status });
      // Fire detail API
      updateDetailMutation.mutate(updated);
    },
    [setStatusMutation, updateDetailMutation],
  );

  const handlePanelClose = useCallback(() => {
    setSelectedQ(null);
    // Clear optimistic once panel closes — real data will have arrived
    setOptimistic(new Map());
  }, []);

  // ── Loading / error states ─────────────────────────────────────────────────
  const isLoading = isFetching || levelsLoading || recordsLoading;

  if (!id) {
    return (
      <EmptyState
        icon="⚠️"
        title="Template not found"
        action={{
          label: "Back to Dashboard",
          onClick: () => navigate({ to: "/" }),
        }}
        data-ocid="template_detail.empty_state"
      />
    );
  }

  if (isLoading) {
    return (
      <div
        className="flex-1 flex items-center justify-center min-h-[60vh]"
        data-ocid="template_detail.loading_state"
      >
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  const selectedRecord =
    selectedQ != null ? (recordMap.get(selectedQ) ?? null) : null;

  return (
    <div className="relative min-h-screen" data-ocid="template_detail.page">
      {/* ── Header ── */}
      <div className="sticky top-0 z-20 bg-card border-b border-border shadow-subtle px-4 py-3">
        <div className="max-w-4xl mx-auto flex items-center gap-3">
          <button
            type="button"
            onClick={() => navigate({ to: "/" })}
            data-ocid="template_detail.back_button"
            aria-label="Back to Dashboard"
            className={cn(
              "flex items-center gap-1.5 text-muted-foreground hover:text-foreground",
              "transition-smooth text-sm font-body shrink-0 min-h-[44px] px-1",
            )}
          >
            ← <span className="hidden sm:inline">Dashboard</span>
          </button>
          <div className="flex-1 min-w-0">
            {template ? (
              <EditableName
                name={template.name}
                onSave={(name) => updateNameMutation.mutate(name)}
              />
            ) : (
              <span className="font-display font-bold text-xl text-foreground">
                Template
              </span>
            )}
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div
        className="max-w-4xl mx-auto px-4 py-4 space-y-4"
        data-ocid="template_detail.content"
      >
        {/* Overall progress */}
        <div
          className="bg-card rounded-xl p-4 border border-border space-y-3"
          data-ocid="template_detail.progress.section"
        >
          <ProgressBar
            label="Overall progress"
            count={attemptedQ}
            total={totalQ}
            colorClass="bg-primary"
          />

          {/* Stats row */}
          <div
            className="grid grid-cols-4 gap-2 pt-1"
            data-ocid="template_detail.stats.section"
          >
            {[
              { label: "Solved", value: correctQ, color: "text-status-solved" },
              {
                label: "Wrong",
                value: incorrectQ,
                color: "text-status-incorrect",
              },
              {
                label: "Unseen",
                value: totalQ - attemptedQ,
                color: "text-muted-foreground",
              },
              {
                label: "Redo",
                value: redoCount,
                color: "text-status-revisit",
              },
            ].map(({ label, value, color }) => (
              <div key={label} className="flex flex-col items-center gap-0.5">
                <span
                  className={cn(
                    "font-mono font-bold text-lg leading-none",
                    color,
                  )}
                >
                  {value}
                </span>
                <span className="text-[10px] text-muted-foreground font-body">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Level accuracy heatmap */}
        {sortedLevels.length > 0 && (
          <LevelHeatmap
            levels={sortedLevels}
            levelQuestions={levelQuestions}
            recordMap={recordMap}
          />
        )}

        {/* Revision suggestions */}
        {sortedLevels.length > 0 && <RevisionSuggestion records={records} />}

        {/* Filter bar */}
        <div
          className="flex flex-col gap-2"
          data-ocid="template_detail.filters.section"
        >
          <FilterBar
            active={filter}
            onChange={setFilter}
            redoCount={redoCount}
          />

          {/* Mistake tag dropdown */}
          <div className="flex items-center gap-2">
            <label
              htmlFor="tag-filter"
              className="text-xs text-muted-foreground font-body shrink-0"
            >
              Tag:
            </label>
            <select
              id="tag-filter"
              value={tagFilter}
              onChange={(e) =>
                setTagFilter(e.target.value as MistakeTag | "none")
              }
              data-ocid="template_detail.tag_filter.select"
              className={cn(
                "text-xs font-body bg-secondary border border-input rounded-lg",
                "px-2 py-1.5 text-foreground focus:outline-none focus:ring-2 focus:ring-ring",
                "min-h-[32px] transition-smooth",
              )}
            >
              <option value="none">All tags</option>
              <option value={MistakeTag.ConceptError}>Concept Error</option>
              <option value={MistakeTag.AlgebraMistake}>Algebra Mistake</option>
              <option value={MistakeTag.SillyMistake}>Silly Mistake</option>
              <option value={MistakeTag.Guessed}>Guessed</option>
              <option value={MistakeTag.TimeIssue}>Time Issue</option>
            </select>
          </div>
        </div>

        {/* Levels + grids */}
        {sortedLevels.length === 0 ? (
          <EmptyState
            icon="📂"
            title="No levels yet"
            description="Add levels to your template to start tracking questions."
            data-ocid="template_detail.levels.empty_state"
          />
        ) : (
          <div data-ocid="template_detail.levels.list">
            {sortedLevels.map((level, idx) => (
              <LevelSection
                key={String(level.id)}
                level={level}
                questions={levelQuestions[idx]}
                recordMap={recordMap}
                redoSet={redoSet}
                filter={filter}
                tagFilter={tagFilter}
                selectedQ={selectedQ}
                onTap={handleCellTap}
                sectionIndex={idx + 1}
              />
            ))}
          </div>
        )}
      </div>

      {/* ── Detail Panel ── */}
      {selectedQ != null && (
        <QuestionDetailPanel
          templateId={templateId}
          questionNumber={selectedQ}
          record={selectedRecord}
          levels={sortedLevels}
          onClose={handlePanelClose}
          onSave={handlePanelSave}
        />
      )}
    </div>
  );
}
