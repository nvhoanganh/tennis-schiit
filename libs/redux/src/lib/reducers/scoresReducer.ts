import { ScoreAction, ScoreActionTypes } from "../actions/scoreActions";

export interface IScoresState {
  entities: {
    [scoreId: string]: any;
  };
  lastDoc?: any;
  hasMore?: boolean;
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
        lastDoc: action.results.lastDoc,
        entities: action.results.after
          ? {
              ...state.entities,
              ...action.results.data
            }
          : action.results.data,
        hasMore: action.results.hasMore
      };

    default:
      return state;
  }
};
export default scores;
