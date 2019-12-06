import { combineReducers } from "redux";
import app from "./appReducer";
import groups from "./groupsReducer";
import players from "./playersReducer";
import scores from "./scoresReducer";

export default combineReducers({
  app,
  groups,
  players,
  scores
});
