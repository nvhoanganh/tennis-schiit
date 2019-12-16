import { AppAction, AppActionTypes } from "../actions";

export interface IAppState {
  pendingRequests: number;
  appLoaded?: boolean;
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
    case AppActionTypes.APP_LOAD:
      return {
        ...state,
        appLoaded: false
      };
    case AppActionTypes.APP_LOADED:
      return {
        ...state,
        appLoaded: true
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
    case AppActionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        user: {
          ...state.user,
          ...action.user
        }
      };
    case AppActionTypes.SIGNOUT_SUCCESS:
      return {
        ...state,
        user: null
      };
    default:
      return state;
  }
};

export default app;
