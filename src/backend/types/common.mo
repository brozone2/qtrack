module {
  public type Timestamp = Int;
  public type TemplateId = Nat;
  public type LevelId = Nat;
  public type QuestionNumber = Nat;

  public type Result<T> = { #ok : T; #err : Text };
};
