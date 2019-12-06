import { AppActionTypes, AppAction } from "../actions";
import { IScore } from "../models";

export interface IScoresState {
  [scoreId: string]: IScore;
}

const scores = (state: IScoresState = {}, action: AppAction): IScoresState => {
  switch (action.type) {
    case AppActionTypes.ADD_SCORE:
      return {
        ...state,
        [action.score.scoreId]: action.score
      };
    case AppActionTypes.LOAD_SCORE_SUCCESS:
      return {
        ...state,
        ...action.scores // load more
      };
    case AppActionTypes.DELETE_SCORE:
      const { [action.id]: deleted, ...newState } = state;
      return newState;
    case AppActionTypes.UPDATE_SCORE:
      return {
        ...state,
        [action.score.scoreId]: action.score
      };
    default:
      return state;
  }
};

export default scores;
