import { IPlayer } from "../models";
import { AppAction, AppActionTypes } from "../actions";

export interface IAppState {
  pendingRequests: number;
  lastAction?: string;
  lastErrorAction?: string;
  lastError?: any;
  user?: any;
  currentGroup?: string;
}

const app = (
  state: IAppState = { pendingRequests: 0 },
  action: AppAction
): IAppState => {
  switch (action.type) {
    case AppActionTypes.API_START:
      return {
        ...state,
        lastAction: action.type,
        pendingRequests: state.pendingRequests + 1
      };
    case AppActionTypes.API_ERROR:
      return {
        ...state,
        pendingRequests: state.pendingRequests - 1,
        lastErrorAction: action.type,
        lastError: action.err
      };
    case AppActionTypes.API_END:
      return {
        ...state,
        pendingRequests: state.pendingRequests - 1
      };
    case AppActionTypes.SIGNIN_SUCCESS:
      return {
        ...state,
        user: action.user
      };
    default:
      return state;
  }
};

export default app;
