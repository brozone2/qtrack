import type { backendInterface } from "../backend";
import { MistakeTag, QuestionStatus } from "../backend";

const now = BigInt(Date.now()) * BigInt(1_000_000);

const templates = [
  { id: BigInt(1), name: "Electrostatics SBT", createdAt: now, updatedAt: now },
  { id: BigInt(2), name: "Mechanics Vol. 1", createdAt: now, updatedAt: now },
];

const levels = [
  { id: BigInt(1), templateId: BigInt(1), name: "Level 1", startQuestion: BigInt(1), endQuestion: BigInt(40), order: BigInt(1) },
  { id: BigInt(2), templateId: BigInt(1), name: "Level 2", startQuestion: BigInt(41), endQuestion: BigInt(110), order: BigInt(2) },
  { id: BigInt(3), templateId: BigInt(1), name: "Level 3", startQuestion: BigInt(111), endQuestion: BigInt(120), order: BigInt(3) },
];

const records: Array<{
  templateId: bigint;
  questionNumber: bigint;
  status: QuestionStatus;
  mistakeTags: MistakeTag[];
  markedForRedo: boolean;
  notes?: string;
  difficultyRating?: bigint;
  lastAttemptedAt?: bigint;
}> = [
  { templateId: BigInt(1), questionNumber: BigInt(1), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(2), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(3), status: QuestionStatus.Incorrect, mistakeTags: [MistakeTag.ConceptError], markedForRedo: true, notes: "Review Coulomb's law derivation" },
  { templateId: BigInt(1), questionNumber: BigInt(4), status: QuestionStatus.Revisit, mistakeTags: [MistakeTag.SillyMistake], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(5), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(6), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(7), status: QuestionStatus.Incorrect, mistakeTags: [MistakeTag.AlgebraMistake], markedForRedo: true },
  { templateId: BigInt(1), questionNumber: BigInt(8), status: QuestionStatus.Revisit, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(9), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(10), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(11), status: QuestionStatus.Unattempted, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(12), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(13), status: QuestionStatus.Incorrect, mistakeTags: [MistakeTag.TimeIssue], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(14), status: QuestionStatus.Revisit, mistakeTags: [], markedForRedo: true },
  { templateId: BigInt(1), questionNumber: BigInt(15), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(20), status: QuestionStatus.Unattempted, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(41), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(42), status: QuestionStatus.Incorrect, mistakeTags: [MistakeTag.ConceptError], markedForRedo: true },
  { templateId: BigInt(1), questionNumber: BigInt(43), status: QuestionStatus.Revisit, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(44), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(111), status: QuestionStatus.Unattempted, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(112), status: QuestionStatus.Unattempted, mistakeTags: [], markedForRedo: false },
  { templateId: BigInt(1), questionNumber: BigInt(113), status: QuestionStatus.Correct, mistakeTags: [], markedForRedo: false },
];

export const mockBackend: backendInterface = {
  getTemplates: async () => templates,

  createTemplate: async (name: string) => {
    const id = BigInt(templates.length + 1);
    const t = { id, name, createdAt: now, updatedAt: now };
    templates.push(t);
    return t;
  },

  updateTemplate: async (id, name) => {
    const t = templates.find((t) => t.id === id);
    if (!t) return { __kind__: "err" as const, err: "Not found" };
    t.name = name;
    return { __kind__: "ok" as const, ok: t };
  },

  deleteTemplate: async (id) => {
    const idx = templates.findIndex((t) => t.id === id);
    if (idx === -1) return { __kind__: "err" as const, err: "Not found" };
    templates.splice(idx, 1);
    return { __kind__: "ok" as const, ok: null };
  },

  getTemplateLevels: async (templateId) =>
    levels.filter((l) => l.templateId === templateId),

  addLevel: async (templateId, name, startQuestion, endQuestion, order) => {
    const id = BigInt(levels.length + 1);
    const l = { id, templateId, name, startQuestion, endQuestion, order };
    levels.push(l);
    return { __kind__: "ok" as const, ok: l };
  },

  updateLevel: async (id, name, startQuestion, endQuestion) => {
    const l = levels.find((l) => l.id === id);
    if (!l) return { __kind__: "err" as const, err: "Not found" };
    l.name = name;
    l.startQuestion = startQuestion;
    l.endQuestion = endQuestion;
    return { __kind__: "ok" as const, ok: l };
  },

  deleteLevel: async (id) => {
    const idx = levels.findIndex((l) => l.id === id);
    if (idx === -1) return { __kind__: "err" as const, err: "Not found" };
    levels.splice(idx, 1);
    return { __kind__: "ok" as const, ok: null };
  },

  getTemplateRecords: async (templateId) =>
    records
      .filter((r) => r.templateId === templateId)
      .map((r) => ({
        templateId: r.templateId,
        questionNumber: r.questionNumber,
        status: r.status,
        mistakeTags: r.mistakeTags,
        markedForRedo: r.markedForRedo,
        notes: r.notes,
        difficultyRating: r.difficultyRating,
        lastAttemptedAt: r.lastAttemptedAt,
      })),

  getQuestionRecord: async (templateId, questionNumber) => {
    const r = records.find(
      (r) => r.templateId === templateId && r.questionNumber === questionNumber
    );
    if (!r) return null;
    return {
      templateId: r.templateId,
      questionNumber: r.questionNumber,
      status: r.status,
      mistakeTags: r.mistakeTags,
      markedForRedo: r.markedForRedo,
      notes: r.notes,
      difficultyRating: r.difficultyRating,
      lastAttemptedAt: r.lastAttemptedAt,
    };
  },

  setQuestionStatus: async (templateId, questionNumber, status) => {
    let r = records.find(
      (r) => r.templateId === templateId && r.questionNumber === questionNumber
    );
    if (!r) {
      r = { templateId, questionNumber, status, mistakeTags: [], markedForRedo: false };
      records.push(r);
    } else {
      r.status = status;
    }
    return {
      templateId: r.templateId,
      questionNumber: r.questionNumber,
      status: r.status,
      mistakeTags: r.mistakeTags,
      markedForRedo: r.markedForRedo,
      notes: r.notes,
      difficultyRating: r.difficultyRating,
      lastAttemptedAt: r.lastAttemptedAt,
    };
  },

  getRedoMarkedQuestions: async (templateId) =>
    records
      .filter((r) => r.templateId === templateId && r.markedForRedo)
      .map((r) => ({
        templateId: r.templateId,
        questionNumber: r.questionNumber,
        status: r.status,
        mistakeTags: r.mistakeTags,
        markedForRedo: r.markedForRedo,
        notes: r.notes,
        difficultyRating: r.difficultyRating,
        lastAttemptedAt: r.lastAttemptedAt,
      })),

  updateQuestionDetail: async (
    templateId,
    questionNumber,
    notes,
    mistakeTags,
    difficultyRating,
    markedForRedo,
    lastAttemptedAt
  ) => {
    let r = records.find(
      (r) => r.templateId === templateId && r.questionNumber === questionNumber
    );
    if (!r) {
      r = {
        templateId,
        questionNumber,
        status: QuestionStatus.Unattempted,
        mistakeTags: [],
        markedForRedo: false,
      };
      records.push(r);
    }
    r.notes = notes ?? undefined;
    r.mistakeTags = mistakeTags;
    r.difficultyRating = difficultyRating ?? undefined;
    r.markedForRedo = markedForRedo;
    r.lastAttemptedAt = lastAttemptedAt ?? undefined;
    return {
      templateId: r.templateId,
      questionNumber: r.questionNumber,
      status: r.status,
      mistakeTags: r.mistakeTags,
      markedForRedo: r.markedForRedo,
      notes: r.notes,
      difficultyRating: r.difficultyRating,
      lastAttemptedAt: r.lastAttemptedAt,
    };
  },
};
