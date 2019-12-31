import { ScoreAction, ScoreActionTypes } from "../actions/scoreActions";

export interface IScoresState {
  entities: {
    [scoreId: string]: any;
  };
  loading?: boolean;
}

const initialState: IScoresState = {
  entities: {}
};
const scores = (
  state: IScoresState = initialState,
  action: ScoreAction
): IScoresState => {
  switch (action.type) {
    case ScoreActionTypes.LOAD_RESULTS_FAILED:
      return {
        ...state,
        loading: true
      };

    case ScoreActionTypes.LOAD_RESULTS:
      return {
        ...state,
        loading: true
      };

    case ScoreActionTypes.LOAD_RESULTS_SUCCESS:
      return {
        ...state,
        loading: false,
        entities: action.results
      };

    default:
      return state;
  }
};
export default scores;
