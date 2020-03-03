/* eslint-disable @typescript-eslint/no-explicit-any */
import { AppAction, AppActionTypes } from "../actions";
import { useToastOptions } from "@chakra-ui/core";

export interface AppState {
  pendingRequests: number;
  appLoaded?: boolean;
  lastAction?: string;
  lastErrorAction?: string;
  pwaHandle?: any;
  lastError?: any;
  appLoadError?: any;
  signInError?: any;
  user?: any;
  currentGroup?: string;
  showToast?: useToastOptions;
  signUpError?: any;
}

const decrementApi = state =>
  state.pendingRequests - 1 < 0 ? 0 : state.pendingRequests - 1;
const app = (
  state: AppState = { pendingRequests: 0 },
  action: AppAction
): AppState => {
  switch (action.type) {
    case AppActionTypes.API_START:
      return {
        ...state,
        lastAction: action.type,
        pendingRequests: state.pendingRequests + 1
      };
    case AppActionTypes.SHOW_TOAST:
      return {
        ...state,
        showToast: action.payload
      };
    case AppActionTypes.APP_LOAD:
      return {
        ...state,
        appLoaded: false
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
    case AppActionTypes.SIGNUP_FAILED:
      return {
        ...state,
        signUpError: action.err
      };
    case AppActionTypes.SIGNUP_SUCCESS:
      return {
        ...state,
        signUpError: null
      };
    case AppActionTypes.PWA_REG:
      return {
        ...state,
        pwaHandle: action.registration
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
