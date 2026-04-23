import Map "mo:core/Map";
import List "mo:core/List";
import Time "mo:core/Time";
import Nat "mo:core/Nat";
import Principal "mo:core/Principal";
import Order "mo:core/Order";
import Types "../types/question-tracking";

module {

  // ── Per-user bucket ────────────────────────────────────────────────────────

  public type UserState = {
    templates : Map.Map<Types.TemplateId, Types.QuestionTemplate>;
    levels    : Map.Map<Types.LevelId, Types.TemplateLevel>;
    records   : Map.Map<(Types.TemplateId, Types.QuestionNumber), Types.QuestionRecord>;
    var nextTemplateId : Nat;
    var nextLevelId    : Nat;
  };

  // Top-level state: one bucket per principal
  public type State = Map.Map<Principal, UserState>;

  // Compare function for composite (TemplateId, QuestionNumber) key
  func compareRecordKey(
    a : (Types.TemplateId, Types.QuestionNumber),
    b : (Types.TemplateId, Types.QuestionNumber),
  ) : Order.Order {
    switch (Nat.compare(a.0, b.0)) {
      case (#equal) Nat.compare(a.1, b.1);
      case (other)  other;
    };
  };

  // ── State constructors ─────────────────────────────────────────────────────

  public func newState() : State {
    Map.empty<Principal, UserState>();
  };

  func newUserState() : UserState {
    {
      templates       = Map.empty<Types.TemplateId, Types.QuestionTemplate>();
      levels          = Map.empty<Types.LevelId, Types.TemplateLevel>();
      records         = Map.empty<(Types.TemplateId, Types.QuestionNumber), Types.QuestionRecord>();
      var nextTemplateId = 0;
      var nextLevelId    = 0;
    };
  };

  // Return existing user state or lazily create one
  func getUserState(state : State, caller : Principal) : UserState {
    switch (state.get(caller)) {
      case (?us) us;
      case null  {
        let us = newUserState();
        state.add(caller, us);
        us;
      };
    };
  };

  // ── Template operations ────────────────────────────────────────────────────

  public func createTemplate(state : State, caller : Principal, name : Text) : Types.QuestionTemplate {
    let us   = getUserState(state, caller);
    let id   = us.nextTemplateId;
    us.nextTemplateId += 1;
    let now  = Time.now();
    let tmpl : Types.QuestionTemplate = { id; name; createdAt = now; updatedAt = now };
    us.templates.add(id, tmpl);
    tmpl;
  };

  public func getTemplates(state : State, caller : Principal) : [Types.QuestionTemplate] {
    let us = getUserState(state, caller);
    us.templates.values() |> _.toList<Types.QuestionTemplate>() |> _.toArray();
  };

  public func updateTemplate(state : State, caller : Principal, id : Types.TemplateId, name : Text) : Types.Result<Types.QuestionTemplate> {
    let us = getUserState(state, caller);
    switch (us.templates.get(id)) {
      case null    #err("Template not found");
      case (?tmpl) {
        let updated : Types.QuestionTemplate = {
          id = tmpl.id;
          name = name;
          createdAt = tmpl.createdAt;
          updatedAt = Time.now();
        };
        us.templates.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteTemplate(state : State, caller : Principal, id : Types.TemplateId) : Types.Result<()> {
    let us = getUserState(state, caller);
    switch (us.templates.get(id)) {
      case null    #err("Template not found");
      case (?_) {
        us.templates.remove(id);
        // Remove all levels belonging to this template
        let levelIds = List.empty<Types.LevelId>();
        us.levels.forEach(func(lid, lv) {
          if (lv.templateId == id) levelIds.add(lid);
        });
        levelIds.forEach(func(lid) { us.levels.remove(lid) });
        // Remove all question records belonging to this template
        let recKeys = List.empty<(Types.TemplateId, Types.QuestionNumber)>();
        us.records.forEach(func(k, _v) {
          if (k.0 == id) recKeys.add(k);
        });
        recKeys.forEach(func(k) { us.records.remove(compareRecordKey, k) });
        #ok(());
      };
    };
  };

  // ── Level operations ───────────────────────────────────────────────────────

  public func addLevel(
    state         : State,
    caller        : Principal,
    templateId    : Types.TemplateId,
    name          : Text,
    startQuestion : Nat,
    endQuestion   : Nat,
    order         : Nat,
  ) : Types.Result<Types.TemplateLevel> {
    let us = getUserState(state, caller);
    switch (us.templates.get(templateId)) {
      case null #err("Template not found");
      case (?_) {
        let id = us.nextLevelId;
        us.nextLevelId += 1;
        let lv : Types.TemplateLevel = { id; templateId; name; startQuestion; endQuestion; order };
        us.levels.add(id, lv);
        #ok(lv);
      };
    };
  };

  public func updateLevel(
    state         : State,
    caller        : Principal,
    id            : Types.LevelId,
    name          : Text,
    startQuestion : Nat,
    endQuestion   : Nat,
  ) : Types.Result<Types.TemplateLevel> {
    let us = getUserState(state, caller);
    switch (us.levels.get(id)) {
      case null     #err("Level not found");
      case (?lv) {
        let updated : Types.TemplateLevel = {
          id = lv.id;
          templateId = lv.templateId;
          name = name;
          startQuestion = startQuestion;
          endQuestion = endQuestion;
          order = lv.order;
        };
        us.levels.add(id, updated);
        #ok(updated);
      };
    };
  };

  public func deleteLevel(state : State, caller : Principal, id : Types.LevelId) : Types.Result<()> {
    let us = getUserState(state, caller);
    switch (us.levels.get(id)) {
      case null  #err("Level not found");
      case (?_) {
        us.levels.remove(id);
        #ok(());
      };
    };
  };

  public func getTemplateLevels(state : State, caller : Principal, templateId : Types.TemplateId) : [Types.TemplateLevel] {
    let us   = getUserState(state, caller);
    let list = us.levels.values()
      |> _.toList<Types.TemplateLevel>()
      |> _.filter(func(lv : Types.TemplateLevel) : Bool { lv.templateId == templateId });
    list.sortInPlace(func(a : Types.TemplateLevel, b : Types.TemplateLevel) : Order.Order {
      Nat.compare(a.order, b.order)
    });
    list.toArray();
  };

  // ── Question record operations ─────────────────────────────────────────────

  public func setQuestionStatus(
    state          : State,
    caller         : Principal,
    templateId     : Types.TemplateId,
    questionNumber : Types.QuestionNumber,
    status         : Types.QuestionStatus,
  ) : Types.QuestionRecord {
    let us  = getUserState(state, caller);
    let key = (templateId, questionNumber);
    let now = Time.now();
    let existing = us.records.get(compareRecordKey, key);
    let lastAttemptedAt : ?Types.Timestamp = switch (status) {
      case (#Unattempted) switch (existing) {
        case (?r) r.lastAttemptedAt;
        case null null;
      };
      case (_) switch (existing) {
        case (?r) switch (r.lastAttemptedAt) {
          case (?ts) ?ts;         // keep original first-attempt time
          case null  ?now;
        };
        case null ?now;
      };
    };
    let rec : Types.QuestionRecord = switch (existing) {
      case null {
        {
          templateId;
          questionNumber;
          status;
          notes           = null;
          mistakeTags     = [];
          difficultyRating = null;
          markedForRedo   = false;
          lastAttemptedAt;
        };
      };
      case (?r) {
        {
          templateId     = r.templateId;
          questionNumber = r.questionNumber;
          status         = status;
          notes          = r.notes;
          mistakeTags    = r.mistakeTags;
          difficultyRating = r.difficultyRating;
          markedForRedo  = r.markedForRedo;
          lastAttemptedAt = lastAttemptedAt;
        }
      };
    };
    us.records.add(compareRecordKey, key, rec);
    rec;
  };

  public func updateQuestionDetail(
    state          : State,
    caller         : Principal,
    templateId     : Types.TemplateId,
    questionNumber : Types.QuestionNumber,
    notes          : ?Text,
    mistakeTags    : [Types.MistakeTag],
    difficultyRating : ?Nat,
    markedForRedo  : Bool,
    lastAttemptedAt : ?Types.Timestamp,
  ) : Types.QuestionRecord {
    let us  = getUserState(state, caller);
    let key = (templateId, questionNumber);
    let rec : Types.QuestionRecord = switch (us.records.get(compareRecordKey, key)) {
      case (?r) {
        {
          templateId     = r.templateId;
          questionNumber = r.questionNumber;
          status         = r.status;
          notes          = notes;
          mistakeTags    = mistakeTags;
          difficultyRating = difficultyRating;
          markedForRedo  = markedForRedo;
          lastAttemptedAt = lastAttemptedAt;
        }
      };
      case null {
        {
          templateId;
          questionNumber;
          status          = #Unattempted;
          notes;
          mistakeTags;
          difficultyRating;
          markedForRedo;
          lastAttemptedAt;
        };
      };
    };
    us.records.add(compareRecordKey, key, rec);
    rec;
  };

  public func getQuestionRecord(
    state          : State,
    caller         : Principal,
    templateId     : Types.TemplateId,
    questionNumber : Types.QuestionNumber,
  ) : ?Types.QuestionRecord {
    let us = getUserState(state, caller);
    us.records.get(compareRecordKey, (templateId, questionNumber));
  };

  public func getTemplateRecords(state : State, caller : Principal, templateId : Types.TemplateId) : [Types.QuestionRecord] {
    let us = getUserState(state, caller);
    us.records.values()
      |> _.toList<Types.QuestionRecord>()
      |> _.filter(func(r : Types.QuestionRecord) : Bool { r.templateId == templateId })
      |> _.toArray();
  };

  public func getRedoMarkedQuestions(state : State, caller : Principal, templateId : Types.TemplateId) : [Types.QuestionRecord] {
    let us = getUserState(state, caller);
    us.records.values()
      |> _.toList<Types.QuestionRecord>()
      |> _.filter(func(r : Types.QuestionRecord) : Bool { r.templateId == templateId and r.markedForRedo })
      |> _.toArray();
  };
};
