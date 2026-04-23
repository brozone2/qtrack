import Lib "lib/question-tracking";
import QuestionTrackingApi "mixins/question-tracking-api";

actor {
  let state = Lib.newState();
  include QuestionTrackingApi(state);
};
