import Common "common";

module {
  public type TemplateId = Common.TemplateId;
  public type LevelId = Common.LevelId;
  public type QuestionNumber = Common.QuestionNumber;
  public type Timestamp = Common.Timestamp;
  public type Result<T> = Common.Result<T>;

  public type QuestionTemplate = {
    id : TemplateId;
    name : Text;
    createdAt : Timestamp;
    updatedAt : Timestamp;
  };

  public type TemplateLevel = {
    id : LevelId;
    templateId : TemplateId;
    name : Text;
    startQuestion : QuestionNumber;
    endQuestion : QuestionNumber;
    order : Nat;
  };

  public type QuestionStatus = {
    #Unattempted;
    #Correct;
    #Incorrect;
    #Revisit;
  };

  public type MistakeTag = {
    #ConceptError;
    #AlgebraMistake;
    #SillyMistake;
    #Guessed;
    #TimeIssue;
  };

  public type QuestionRecord = {
    templateId : TemplateId;
    questionNumber : QuestionNumber;
    status : QuestionStatus;
    notes : ?Text;
    mistakeTags : [MistakeTag];
    difficultyRating : ?Nat;
    markedForRedo : Bool;
    lastAttemptedAt : ?Timestamp;
  };
};
