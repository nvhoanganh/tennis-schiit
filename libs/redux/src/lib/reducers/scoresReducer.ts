import { ScoreActionTypes, ScoreAction } from "../actions/scoreActions";
import { IScore } from "../models";

export interface IScoresState {
  entities: {
    [scoreId: string]: IScore;
  };
  scoreCount: number;
  offset: number;
}

const initialState: IScoresState = {
  entities: {},
  scoreCount: 0,
  offset: 0
};
const scores = (
  state: IScoresState = initialState,
  action: ScoreAction
): IScoresState => {
  switch (action.type) {
    case ScoreActionTypes.ADD_SCORE:
      return {
        ...state,
        [action.score.scoreId]: action.score
      };
    case ScoreActionTypes.LOAD_SCORE_SUCCESS:
      return {
        ...state,
        entities: action.scores.scores,
        scoreCount: action.scores.total,
        offset: action.scores.offset
      };
    case ScoreActionTypes.DELETE_SCORE:
      const { [action.id]: deleted, ...newEntities } = state.entities;
      return {
        ...state,
        entities: newEntities
      };

    case ScoreActionTypes.UPDATE_SCORE:
      return {
        ...state,
        [action.score.scoreId]: action.score
      };
    default:
      return state;
  }
};
export default scores;
