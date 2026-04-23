// Re-export backend types for convenience
export type {
  QuestionTemplate,
  TemplateLevel,
  QuestionRecord,
  Timestamp,
  TemplateId,
  LevelId,
  QuestionNumber,
} from "./backend.d";
export { QuestionStatus, MistakeTag } from "./backend";

// Frontend-specific filter types
export type StatusFilter =
  | "all"
  | "correct"
  | "incorrect"
  | "revisit"
  | "unattempted"
  | "redo";
export type MistakeTagFilter = import("./backend").MistakeTag | "none";

// Optimistic question state keyed by questionNumber (as string for Map key)
export type QuestionStatusMap = Map<string, import("./backend").QuestionStatus>;
