import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export type Timestamp = bigint;
export type Result_2 = {
    __kind__: "ok";
    ok: null;
} | {
    __kind__: "err";
    err: string;
};
export type Result = {
    __kind__: "ok";
    ok: QuestionTemplate;
} | {
    __kind__: "err";
    err: string;
};
export interface QuestionRecord {
    status: QuestionStatus;
    templateId: TemplateId;
    lastAttemptedAt?: Timestamp;
    mistakeTags: Array<MistakeTag>;
    difficultyRating?: bigint;
    markedForRedo: boolean;
    notes?: string;
    questionNumber: QuestionNumber;
}
export type TemplateId = bigint;
export type QuestionNumber = bigint;
export type LevelId = bigint;
export interface QuestionTemplate {
    id: TemplateId;
    name: string;
    createdAt: Timestamp;
    updatedAt: Timestamp;
}
export type Result_1 = {
    __kind__: "ok";
    ok: TemplateLevel;
} | {
    __kind__: "err";
    err: string;
};
export interface TemplateLevel {
    id: LevelId;
    startQuestion: QuestionNumber;
    order: bigint;
    templateId: TemplateId;
    name: string;
    endQuestion: QuestionNumber;
}
export enum MistakeTag {
    TimeIssue = "TimeIssue",
    SillyMistake = "SillyMistake",
    AlgebraMistake = "AlgebraMistake",
    ConceptError = "ConceptError",
    Guessed = "Guessed"
}
export enum QuestionStatus {
    Incorrect = "Incorrect",
    Correct = "Correct",
    Unattempted = "Unattempted",
    Revisit = "Revisit"
}
export interface backendInterface {
    addLevel(templateId: TemplateId, name: string, startQuestion: bigint, endQuestion: bigint, order: bigint): Promise<Result_1>;
    createTemplate(name: string): Promise<QuestionTemplate>;
    deleteLevel(id: LevelId): Promise<Result_2>;
    deleteTemplate(id: TemplateId): Promise<Result_2>;
    getQuestionRecord(templateId: TemplateId, questionNumber: bigint): Promise<QuestionRecord | null>;
    getRedoMarkedQuestions(templateId: TemplateId): Promise<Array<QuestionRecord>>;
    getTemplateLevels(templateId: TemplateId): Promise<Array<TemplateLevel>>;
    getTemplateRecords(templateId: TemplateId): Promise<Array<QuestionRecord>>;
    getTemplates(): Promise<Array<QuestionTemplate>>;
    setQuestionStatus(templateId: TemplateId, questionNumber: bigint, status: QuestionStatus): Promise<QuestionRecord>;
    updateLevel(id: LevelId, name: string, startQuestion: bigint, endQuestion: bigint): Promise<Result_1>;
    updateQuestionDetail(templateId: TemplateId, questionNumber: bigint, notes: string | null, mistakeTags: Array<MistakeTag>, difficultyRating: bigint | null, markedForRedo: boolean, lastAttemptedAt: Timestamp | null): Promise<QuestionRecord>;
    updateTemplate(id: TemplateId, name: string): Promise<Result>;
}
