import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { useNavigate } from "@tanstack/react-router";
import { AlertCircle, ChevronRight, Plus, Trash2 } from "lucide-react";
import { useId, useState } from "react";
import { useBackend } from "../hooks/useBackend";
import { useCreateTemplate } from "../hooks/useTemplates";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface LevelRow {
  id: string;
  name: string;
  startQ: string;
  endQ: string;
}

interface LevelError {
  name?: string;
  startQ?: string;
  endQ?: string;
  range?: string;
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateLevels(rows: LevelRow[]): {
  valid: boolean;
  errors: LevelError[];
} {
  const errors: LevelError[] = rows.map(() => ({}));
  let valid = true;

  rows.forEach((row, i) => {
    if (!row.name.trim()) {
      errors[i].name = "Level name is required";
      valid = false;
    }
    const start = Number.parseInt(row.startQ, 10);
    const end = Number.parseInt(row.endQ, 10);

    if (!row.startQ || Number.isNaN(start) || start < 1) {
      errors[i].startQ = "Enter a valid start (≥ 1)";
      valid = false;
    }
    if (!row.endQ || Number.isNaN(end) || end < 1) {
      errors[i].endQ = "Enter a valid end (≥ 1)";
      valid = false;
    }
    if (!errors[i].startQ && !errors[i].endQ && start >= end) {
      errors[i].range = "Start must be less than end";
      valid = false;
    }
  });

  // Check overlaps between levels
  if (valid) {
    for (let i = 0; i < rows.length; i++) {
      for (let j = i + 1; j < rows.length; j++) {
        const aStart = Number.parseInt(rows[i].startQ, 10);
        const aEnd = Number.parseInt(rows[i].endQ, 10);
        const bStart = Number.parseInt(rows[j].startQ, 10);
        const bEnd = Number.parseInt(rows[j].endQ, 10);
        const overlaps = aStart <= bEnd && bStart <= aEnd;
        if (overlaps) {
          errors[i].range = `Overlaps with Level ${j + 1}`;
          errors[j].range = `Overlaps with Level ${i + 1}`;
          valid = false;
        }
      }
    }
  }

  return { valid, errors };
}

// ---------------------------------------------------------------------------
// LevelRow component
// ---------------------------------------------------------------------------

interface LevelRowProps {
  row: LevelRow;
  index: number;
  error: LevelError;
  canRemove: boolean;
  onChange: (id: string, field: keyof LevelRow, value: string) => void;
  onRemove: (id: string) => void;
}

function LevelRowItem({
  row,
  index,
  error,
  canRemove,
  onChange,
  onRemove,
}: LevelRowProps) {
  const prefix = `level_${index}`;
  return (
    <div
      data-ocid={`create_template.level_row.${index}`}
      className="group relative bg-secondary/50 border border-border rounded-lg p-4 flex flex-col gap-3"
    >
      {/* Row header */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-display font-semibold text-muted-foreground uppercase tracking-wider">
          Level {index}
        </span>
        {canRemove && (
          <button
            type="button"
            onClick={() => onRemove(row.id)}
            data-ocid={`create_template.remove_level_button.${index}`}
            aria-label={`Remove Level ${index}`}
            className="w-7 h-7 rounded flex items-center justify-center text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-smooth focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Fields grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Name */}
        <div className="sm:col-span-1 flex flex-col gap-1">
          <Label
            htmlFor={`${prefix}-name`}
            className="text-xs text-muted-foreground font-body"
          >
            Name
          </Label>
          <Input
            id={`${prefix}-name`}
            data-ocid={`create_template.level_name_input.${index}`}
            placeholder="e.g. Level 1"
            value={row.name}
            onChange={(e) => onChange(row.id, "name", e.target.value)}
            className={cn(
              error.name && "border-destructive focus-visible:ring-destructive",
            )}
          />
          {error.name && (
            <p
              data-ocid={`create_template.level_name_error.${index}`}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {error.name}
            </p>
          )}
        </div>

        {/* Start Q */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`${prefix}-start`}
            className="text-xs text-muted-foreground font-body"
          >
            Start Q#
          </Label>
          <Input
            id={`${prefix}-start`}
            data-ocid={`create_template.level_start_input.${index}`}
            type="number"
            placeholder="1"
            min={1}
            value={row.startQ}
            onChange={(e) => onChange(row.id, "startQ", e.target.value)}
            className={cn(
              "font-mono",
              (error.startQ || error.range) &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {error.startQ && (
            <p
              data-ocid={`create_template.level_start_error.${index}`}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {error.startQ}
            </p>
          )}
        </div>

        {/* End Q */}
        <div className="flex flex-col gap-1">
          <Label
            htmlFor={`${prefix}-end`}
            className="text-xs text-muted-foreground font-body"
          >
            End Q#
          </Label>
          <Input
            id={`${prefix}-end`}
            data-ocid={`create_template.level_end_input.${index}`}
            type="number"
            placeholder="40"
            min={1}
            value={row.endQ}
            onChange={(e) => onChange(row.id, "endQ", e.target.value)}
            className={cn(
              "font-mono",
              (error.endQ || error.range) &&
                "border-destructive focus-visible:ring-destructive",
            )}
          />
          {error.endQ && (
            <p
              data-ocid={`create_template.level_end_error.${index}`}
              className="text-xs text-destructive flex items-center gap-1"
            >
              <AlertCircle className="w-3 h-3 shrink-0" />
              {error.endQ}
            </p>
          )}
        </div>
      </div>

      {/* Range error (overlap / start>=end) */}
      {error.range && (
        <p
          data-ocid={`create_template.level_range_error.${index}`}
          className="text-xs text-destructive flex items-center gap-1"
        >
          <AlertCircle className="w-3 h-3 shrink-0" />
          {error.range}
        </p>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// CreateTemplate page
// ---------------------------------------------------------------------------

let _rowCounter = 0;
function newRow(defaults?: Partial<LevelRow>): LevelRow {
  _rowCounter += 1;
  return {
    id: `row-${_rowCounter}`,
    name: defaults?.name ?? "",
    startQ: defaults?.startQ ?? "",
    endQ: defaults?.endQ ?? "",
  };
}

export default function CreateTemplate() {
  const navigate = useNavigate();
  const formId = useId();

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [levels, setLevels] = useState<LevelRow[]>(() => [
    newRow({ name: "Level 1", startQ: "1", endQ: "40" }),
  ]);
  const [levelErrors, setLevelErrors] = useState<LevelError[]>([{}]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const { mutateAsync: createTemplate } = useCreateTemplate();
  const { actor } = useBackend();

  // ── Level row handlers ──────────────────────────────────────────────────

  const addLevel = () => {
    const nextNum = levels.length + 1;
    setLevels((prev) => [...prev, newRow({ name: `Level ${nextNum}` })]);
    setLevelErrors((prev) => [...prev, {}]);
  };

  const removeLevel = (id: string) => {
    const idx = levels.findIndex((l) => l.id === id);
    setLevels((prev) => prev.filter((l) => l.id !== id));
    setLevelErrors((prev) => prev.filter((_, i) => i !== idx));
  };

  const updateLevel = (id: string, field: keyof LevelRow, value: string) => {
    setLevels((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l)),
    );
    // Clear errors on edit
    const idx = levels.findIndex((l) => l.id === id);
    if (idx !== -1) {
      setLevelErrors((prev) => prev.map((e, i) => (i === idx ? {} : e)));
    }
  };

  // ── Submit ───────────────────────────────────────────────────────────────

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let hasError = false;

    // Validate name
    if (!name.trim()) {
      setNameError("Template name is required");
      hasError = true;
    } else {
      setNameError("");
    }

    // Validate levels
    const { valid, errors } = validateLevels(levels);
    setLevelErrors(errors);
    if (!valid) hasError = true;

    if (hasError) return;

    setIsSubmitting(true);
    setSubmitError("");

    try {
      const template = await createTemplate(name.trim());

      // Add each level sequentially
      for (let idx = 0; idx < levels.length; idx++) {
        const level = levels[idx];
        if (!actor) throw new Error("Not connected");
        const result = await actor.addLevel(
          template.id,
          level.name.trim(),
          BigInt(Number.parseInt(level.startQ, 10)),
          BigInt(Number.parseInt(level.endQ, 10)),
          BigInt(idx),
        );
        if (result.__kind__ === "err") {
          throw new Error(result.err);
        }
      }

      navigate({ to: "/template/$id", params: { id: String(template.id) } });
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Something went wrong",
      );
      setIsSubmitting(false);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────

  return (
    <div
      className="max-w-2xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="create_template.page"
    >
      {/* Header */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground font-body mb-6">
        <button
          type="button"
          onClick={() => navigate({ to: "/" })}
          data-ocid="create_template.breadcrumb_home"
          className="hover:text-foreground transition-smooth"
        >
          Templates
        </button>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-foreground">New Template</span>
      </div>

      <h1 className="text-2xl font-display font-bold text-foreground mb-8">
        Create Template
      </h1>

      <form id={formId} onSubmit={handleSubmit} className="flex flex-col gap-6">
        {/* Template name */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
          <h2 className="text-sm font-display font-semibold text-foreground">
            Template Details
          </h2>
          <div className="flex flex-col gap-1.5">
            <Label
              htmlFor="template-name"
              className="text-sm font-body text-foreground"
            >
              Template name <span className="text-destructive">*</span>
            </Label>
            <Input
              id="template-name"
              data-ocid="create_template.name_input"
              placeholder="e.g. Electrostatics SBT"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (nameError) setNameError("");
              }}
              autoFocus
              maxLength={100}
              className={cn(
                nameError &&
                  "border-destructive focus-visible:ring-destructive",
              )}
            />
            {nameError && (
              <p
                data-ocid="create_template.name_error"
                className="text-xs text-destructive flex items-center gap-1"
              >
                <AlertCircle className="w-3 h-3 shrink-0" />
                {nameError}
              </p>
            )}
          </div>
        </div>

        {/* Levels */}
        <div className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-display font-semibold text-foreground">
              Question Levels
            </h2>
            <span className="text-xs text-muted-foreground font-mono">
              {levels.length} level{levels.length !== 1 ? "s" : ""}
            </span>
          </div>

          <div
            className="flex flex-col gap-3"
            data-ocid="create_template.level_list"
          >
            {levels.map((row, i) => (
              <LevelRowItem
                key={row.id}
                row={row}
                index={i + 1}
                error={levelErrors[i] ?? {}}
                canRemove={levels.length > 1}
                onChange={updateLevel}
                onRemove={removeLevel}
              />
            ))}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={addLevel}
            data-ocid="create_template.add_level_button"
            className="w-full gap-2 border-dashed"
          >
            <Plus className="w-4 h-4" />
            Add Level
          </Button>
        </div>

        {/* Submit error */}
        {submitError && (
          <div
            data-ocid="create_template.submit_error_state"
            className="flex items-center gap-2 text-sm text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-4 py-3"
          >
            <AlertCircle className="w-4 h-4 shrink-0" />
            {submitError}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 justify-end pt-1">
          <Button
            type="button"
            variant="ghost"
            onClick={() => navigate({ to: "/" })}
            data-ocid="create_template.cancel_button"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting}
            data-ocid="create_template.submit_button"
            className="gap-2 min-w-[140px]"
          >
            {isSubmitting ? (
              <>
                <span className="w-4 h-4 rounded-full border-2 border-primary-foreground/30 border-t-primary-foreground animate-spin" />
                Creating…
              </>
            ) : (
              "Create Template"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}
