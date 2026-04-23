import { QuestionStatus } from "../backend";

/** Returns the Tailwind utility class for the cell background */
export function statusBgClass(status: QuestionStatus): string {
  if (status === QuestionStatus.Correct) return "bg-status-solved";
  if (status === QuestionStatus.Incorrect) return "bg-status-incorrect";
  if (status === QuestionStatus.Revisit) return "bg-status-revisit";
  return "bg-status-unattempted";
}

/** Returns a human-readable label for the status */
export function statusLabel(status: QuestionStatus): string {
  if (status === QuestionStatus.Correct) return "Solved";
  if (status === QuestionStatus.Incorrect) return "Incorrect";
  if (status === QuestionStatus.Revisit) return "Revisit";
  return "Unattempted";
}

/** Returns the text color class to use on top of the status background */
export function statusTextClass(status: QuestionStatus): string {
  if (status === QuestionStatus.Unattempted) return "text-foreground/60";
  return "text-foreground";
}

/** Cycle through statuses on tap: Unattempted → Correct → Incorrect → Revisit → Unattempted */
export function nextStatus(current: QuestionStatus): QuestionStatus {
  if (current === QuestionStatus.Unattempted) return QuestionStatus.Correct;
  if (current === QuestionStatus.Correct) return QuestionStatus.Incorrect;
  if (current === QuestionStatus.Incorrect) return QuestionStatus.Revisit;
  return QuestionStatus.Unattempted;
}
