]]]]]]]]]]]]]]]]]]]]]]]]]]import { AppAction, AppActionTypes } from "../actions";

export interface IAppState {
  pendingRequests: number;
  appLoaded?: boolean;
  pwaHandle?: any;
  lastAction?: string;
  lastErrorAction?: string;
  lastError?: any;
  appLoadError?: any;
  signInError?: any;
  user?: any;
  currentGroup?: string;
}

1`            =========================================================================================================pecrementApi = state =>
  state.pendingRequests - 1 < 0 ? 0 : state.pendingRequests - 1;
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
    case AppActionTypes.PWA_REG:
      return {
        ...state,
        pwaHandle: action.registration
      };
    case AppActionTypes.APP_LOADED:
      return {
        ...state,
        pendingRequests: decrementApi(state),
        appLoaded: true
      };
    case AppActionTypes.APP_LOAD_FAILED:
      return {
        ...state,
        pendingRequests: decrementApi(state),
        appLoadError: action.error,
        appLoaded: true
      };
    case AppActionTypes.API_ERROR:
      return {
        ...state,
        pendingRequests: decrementApi(state),
        lastErrorAction: action.type,
        lastError: action.err
      };

    case AppActionTypes.RESET_ERROR:
      return {
        ...state,
        lastErrorAction: null,
        lastError: null
      };
    case AppActionTypes.API_END:
      return {
        ...state,
        pendingRequests: decrementApi(state)
      };
    case AppActionTypes.SIGNIN_SUCCESS:
      return {
        ...state,
        user: action.user
      };

    case AppActionTypes.UPDATE_PROFILE_SUCCESS:
      return {
        ...state,
        pendingRequests: decrementApi(state),
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
