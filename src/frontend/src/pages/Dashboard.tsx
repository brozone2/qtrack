import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { BookOpen, Layers, Plus } from "lucide-react";
import type {
  QuestionRecord,
  QuestionTemplate,
  TemplateLevel,
} from "../backend.d";
import { QuestionStatus } from "../backend.d";
import { EmptyState } from "../components/EmptyState";
import { ProgressBar } from "../components/ProgressBar";
import { useBackend } from "../hooks/useBackend";
import { useTemplates } from "../hooks/useTemplates";

// ---------------------------------------------------------------------------
// Per-template card — fetches its own levels + records
// ---------------------------------------------------------------------------

interface TemplateCardProps {
  template: QuestionTemplate;
  index: number;
  onClick: () => void;
}

function TemplateCard({ template, index, onClick }: TemplateCardProps) {
  const { actor, isFetching } = useBackend();

  const { data: levels } = useQuery<TemplateLevel[]>({
    queryKey: ["levels", String(template.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateLevels(template.id);
    },
    enabled: !!actor && !isFetching,
  });

  const { data: records } = useQuery<QuestionRecord[]>({
    queryKey: ["records", String(template.id)],
    queryFn: async () => {
      if (!actor) return [];
      return actor.getTemplateRecords(template.id);
    },
    enabled: !!actor && !isFetching,
  });

  const totalQuestions =
    levels?.reduce(
      (acc, l) => acc + Number(l.endQuestion - l.startQuestion + 1n),
      0,
    ) ?? 0;

  const attempted =
    records?.filter((r) => r.status !== QuestionStatus.Unattempted).length ?? 0;

  const correct =
    records?.filter((r) => r.status === QuestionStatus.Correct).length ?? 0;

  const levelCount = levels?.length ?? 0;

  const createdDate = new Date(
    Number(template.createdAt) / 1_000_000,
  ).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <button
      type="button"
      onClick={onClick}
      data-ocid={`dashboard.template_card.${index}`}
      className="group text-left bg-card border border-border rounded-xl p-5 flex flex-col gap-4 transition-smooth hover:border-primary/40 hover:shadow-elevated active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring min-h-[160px]"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="min-w-0">
          <p className="font-display font-semibold text-foreground text-base leading-snug truncate">
            {template.name}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5 font-body">
            {createdDate}
          </p>
        </div>
        <div className="shrink-0 w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-smooth">
          <BookOpen className="w-4 h-4 text-primary" />
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center gap-4 text-xs font-body text-muted-foreground">
        <span className="flex items-center gap-1">
          <Layers className="w-3.5 h-3.5" />
          {levelCount === 0
            ? "—"
            : `${levelCount} level${levelCount !== 1 ? "s" : ""}`}
        </span>
        <span className="flex items-center gap-1">
          <BookOpen className="w-3.5 h-3.5" />
          {totalQuestions === 0 ? "—" : `${totalQuestions} questions`}
        </span>
      </div>

      {/* Progress */}
      {totalQuestions > 0 ? (
        <div className="flex flex-col gap-2 mt-auto">
          <ProgressBar
            label="Attempted"
            count={attempted}
            total={totalQuestions}
            colorClass="bg-primary"
          />
          <ProgressBar
            label="Correct"
            count={correct}
            total={totalQuestions}
            colorClass="bg-status-solved"
          />
        </div>
      ) : (
        <p className="text-xs text-muted-foreground mt-auto font-body italic">
          No levels added yet
        </p>
      )}
    </button>
  );
}

// ---------------------------------------------------------------------------
// Skeleton card for loading state
// ---------------------------------------------------------------------------

function TemplateCardSkeleton({ index }: { index: number }) {
  return (
    <div
      data-ocid={`dashboard.template_skeleton.${index}`}
      className="bg-card border border-border rounded-xl p-5 flex flex-col gap-4 min-h-[160px]"
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-3 w-1/3" />
        </div>
        <Skeleton className="w-8 h-8 rounded-lg shrink-0" />
      </div>
      <div className="flex gap-4">
        <Skeleton className="h-3 w-16" />
        <Skeleton className="h-3 w-20" />
      </div>
      <div className="flex flex-col gap-2 mt-auto">
        <Skeleton className="h-2 w-full rounded-full" />
        <Skeleton className="h-2 w-full rounded-full" />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Dashboard page
// ---------------------------------------------------------------------------

export default function Dashboard() {
  const { data: templates, isLoading } = useTemplates();
  const navigate = useNavigate();

  const handleNew = () => navigate({ to: "/template/new" });

  return (
    <div
      className="max-w-7xl mx-auto px-4 sm:px-6 py-8"
      data-ocid="dashboard.page"
    >
      {/* Page header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-display font-bold text-foreground">
            My Templates
          </h1>
          <p className="text-sm text-muted-foreground font-body mt-0.5">
            Track your question progress by chapter or book
          </p>
        </div>
        <Button
          onClick={handleNew}
          data-ocid="dashboard.new_template_button"
          className="gap-2 shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Template</span>
          <span className="sm:hidden">New</span>
        </Button>
      </div>

      {/* Loading state */}
      {isLoading && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="dashboard.loading_state"
        >
          {[1, 2, 3].map((i) => (
            <TemplateCardSkeleton key={i} index={i} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isLoading && (!templates || templates.length === 0) && (
        <div
          className="flex flex-col items-center justify-center py-20 px-6"
          data-ocid="dashboard.empty_state"
        >
          <div className="w-20 h-20 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
            <BookOpen className="w-10 h-10 text-primary" />
          </div>
          <EmptyState
            title="No templates yet"
            description="Create a template for a book or chapter, define question ranges, and start tracking your progress."
            action={{ label: "Create your first template", onClick: handleNew }}
            className="py-0"
          />
        </div>
      )}

      {/* Template grid */}
      {!isLoading && templates && templates.length > 0 && (
        <div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4"
          data-ocid="dashboard.template_list"
        >
          {templates.map((t, i) => (
            <TemplateCard
              key={String(t.id)}
              template={t}
              index={i + 1}
              onClick={() =>
                navigate({ to: "/template/$id", params: { id: String(t.id) } })
              }
            />
          ))}
        </div>
      )}
    </div>
  );
}
