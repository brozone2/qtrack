import { cn } from "@/lib/utils";
import type { QuestionStatus } from "../backend";
import { statusBgClass, statusTextClass } from "../utils/questionStatus";

interface QuestionCellProps {
  questionNumber: number;
  status: QuestionStatus;
  isSelected?: boolean;
  isMarkedForRedo?: boolean;
  onTap: (questionNumber: number) => void;
  "data-ocid"?: string;
}

export function QuestionCell({
  questionNumber,
  status,
  isSelected = false,
  isMarkedForRedo = false,
  onTap,
  "data-ocid": dataOcid,
}: QuestionCellProps) {
  const bgClass = statusBgClass(status);
  const textClass = statusTextClass(status);

  return (
    <button
      type="button"
      data-ocid={dataOcid}
      onClick={() => onTap(questionNumber)}
      aria-label={`Question ${questionNumber}`}
      aria-pressed={isSelected}
      className={cn(
        "relative flex items-center justify-center rounded",
        "min-w-[48px] min-h-[48px] w-full aspect-square",
        "text-sm font-mono font-medium leading-none",
        "transition-smooth select-none",
        bgClass,
        textClass,
        isSelected
          ? "ring-2 ring-primary ring-offset-1 ring-offset-background scale-95"
          : "hover:brightness-110 active:scale-95",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
      )}
    >
      {questionNumber}
      {isMarkedForRedo && (
        <span
          aria-hidden
          className="absolute top-0.5 right-0.5 w-1.5 h-1.5 rounded-full bg-primary"
        />
      )}
    </button>
  );
}
