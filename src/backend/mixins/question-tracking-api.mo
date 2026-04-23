import Principal "mo:core/Principal";
import Types "../types/question-tracking";
import Lib "../lib/question-tracking";

mixin (state : Lib.State) {

  // --- Template API ---

  public shared ({ caller }) func createTemplate(name : Text) : async Types.QuestionTemplate {
    Lib.createTemplate(state, caller, name);
  };

  public query ({ caller }) func getTemplates() : async [Types.QuestionTemplate] {
    Lib.getTemplates(state, caller);
  };

  public shared ({ caller }) func updateTemplate(id : Types.TemplateId, name : Text) : async Types.Result<Types.QuestionTemplate> {
    Lib.updateTemplate(state, caller, id, name);
  };

  public shared ({ caller }) func deleteTemplate(id : Types.TemplateId) : async Types.Result<()> {
    Lib.deleteTemplate(state, caller, id);
  };

  public shared ({ caller }) func addLevel(
    templateId    : Types.TemplateId,
    name          : Text,
    startQuestion : Nat,
    endQuestion   : Nat,
    order         : Nat,
  ) : async Types.Result<Types.TemplateLevel> {
    Lib.addLevel(state, caller, templateId, name, startQuestion, endQuestion, order);
  };

  public shared ({ caller }) func updateLevel(
    id            : Types.LevelId,
    name          : Text,
    startQuestion : Nat,
    endQuestion   : Nat,
  ) : async Types.Result<Types.TemplateLevel> {
    Lib.updateLevel(state, caller, id, name, startQuestion, endQuestion);
  };

  public shared ({ caller }) func deleteLevel(id : Types.LevelId) : async Types.Result<()> {
    Lib.deleteLevel(state, caller, id);
  };

  public query ({ caller }) func getTemplateLevels(templateId : Types.TemplateId) : async [Types.TemplateLevel] {
    Lib.getTemplateLevels(state, caller, templateId);
  };

  // --- Question Record API ---

  public shared ({ caller }) func setQuestionStatus(
    templateId     : Types.TemplateId,
    questionNumber : Nat,
    status         : Types.QuestionStatus,
  ) : async Types.QuestionRecord {
    Lib.setQuestionStatus(state, caller, templateId, questionNumber, status);
  };

  public shared ({ caller }) func updateQuestionDetail(
    templateId       : Types.TemplateId,
    questionNumber   : Nat,
    notes            : ?Text,
    mistakeTags      : [Types.MistakeTag],
    difficultyRating : ?Nat,
    markedForRedo    : Bool,
    lastAttemptedAt  : ?Types.Timestamp,
  ) : async Types.QuestionRecord {
    Lib.updateQuestionDetail(state, caller, templateId, questionNumber, notes, mistakeTags, difficultyRating, markedForRedo, lastAttemptedAt);
  };

  public query ({ caller }) func getQuestionRecord(
    templateId     : Types.TemplateId,
    questionNumber : Nat,
  ) : async ?Types.QuestionRecord {
    Lib.getQuestionRecord(state, caller, templateId, questionNumber);
  };

  public query ({ caller }) func getTemplateRecords(templateId : Types.TemplateId) : async [Types.QuestionRecord] {
    Lib.getTemplateRecords(state, caller, templateId);
  };

  public query ({ caller }) func getRedoMarkedQuestions(templateId : Types.TemplateId) : async [Types.QuestionRecord] {
    Lib.getRedoMarkedQuestions(state, caller, templateId);
  };

};
