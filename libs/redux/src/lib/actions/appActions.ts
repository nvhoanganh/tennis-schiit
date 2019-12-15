import { IAction, delay } from "../utils";
import { ISignInModel } from "../models";
import { FBCONF } from "@tennis-score/api-interfaces";

import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

export enum AppActionTypes {
  API_ERROR = "LAST_API_ERROR",
  API_START = "API_START",
  API_END = "API_END",

  APP_LOAD = "APP_LOAD",
  SIGNIN = "SIGNIN",
  SIGNIN_SUCCESS = "SIGNIN_SUCCESS",

  SIGNOUT = "SIGNOUT",
  SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS",

  SIGNUP = "SIGNUP",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS"
}

export class ApiStartAction implements IAction {
  readonly type = AppActionTypes.API_START;
  constructor(public action: string) {}
}
export class AppLoadAction implements IAction {
  readonly type = AppActionTypes.APP_LOAD;
}
export class ApiEndAction implements IAction {
  readonly type = AppActionTypes.API_END;
}
export class ApiErrorAction implements IAction {
  readonly type = AppActionTypes.API_ERROR;
  constructor(public action: string, public err: any) {}
}

export class SignInSuccessAction implements IAction {
  readonly type = AppActionTypes.SIGNIN_SUCCESS;
  constructor(public user: any) {}
}
export class SignUpSuccessAction implements IAction {
  readonly type = AppActionTypes.SIGNUP_SUCCESS;
  constructor(public user: any) {}
}
export class SignOutSuccessAction implements IAction {
  readonly type = AppActionTypes.SIGNOUT_SUCCESS;
}

export function apiStart(action: string): ApiStartAction {
  return { type: AppActionTypes.API_START, action };
}
export function apiEnd(): ApiEndAction {
  return { type: AppActionTypes.API_END };
}
export function apiError(action: string, err: any): ApiErrorAction {
  return { type: AppActionTypes.API_ERROR, action, err };
}

// thunks
export function signIn({ email, password }: ISignInModel) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNIN));
    firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: AppActionTypes.SIGNIN_SUCCESS, user }))
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function signUp({ email, password }: ISignInModel) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNUP));
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => dispatch({ type: AppActionTypes.SIGNUP_SUCCESS, user }))
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function signOut() {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNOUT));
    firebase
      .auth()
      .signOut()
      .then(_ => dispatch({ type: AppActionTypes.SIGNOUT_SUCCESS }))
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function appLoad() {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.API_START));
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        console.log("user is authenticated", user);
        dispatch({ type: AppActionTypes.SIGNIN_SUCCESS, user });
      }
    });
  };
}

firebase.initializeApp(FBCONF);

export type AppAction =
  | AppLoadAction
  | ApiStartAction
  | ApiEndAction
  | ApiErrorAction
  | SignInSuccessAction
  | SignOutSuccessAction
  | SignUpSuccessAction;
