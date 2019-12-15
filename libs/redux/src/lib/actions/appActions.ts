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
  APP_LOADED = "APP_LOADED",

  SIGNIN = "SIGNIN",
  SIGNIN_SUCCESS = "SIGNIN_SUCCESS",

  SIGNOUT = "SIGNOUT",
  SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS",

  SIGNUP = "SIGNUP",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS",

  UPDATE_PROFILE = "UPDATE_PROFILE",
  UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS"
}

export class ApiStartAction implements IAction {
  readonly type = AppActionTypes.API_START;
  constructor(public action: string) {}
}
export class AppLoadAction implements IAction {
  readonly type = AppActionTypes.APP_LOAD;
}
export class AppLoadedAction implements IAction {
  readonly type = AppActionTypes.APP_LOADED;
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

export class UpdateProfileAction implements IAction {
  readonly type = AppActionTypes.UPDATE_PROFILE;
  constructor(public user: any) {}
}
export class UpdateProfileSuccessAction implements IAction {
  readonly type = AppActionTypes.UPDATE_PROFILE_SUCCESS;
  constructor(public user: any) {}
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
      .then(user =>
        dispatch({ type: AppActionTypes.SIGNIN_SUCCESS, user: user.user })
      )
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function signUp({ email, password }: ISignInModel) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNUP));
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user =>
        dispatch({ type: AppActionTypes.SIGNUP_SUCCESS, user: user.user })
      )
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function updateProfile({
  displayName,
  leftHanded,
  singleHandedBackhand,
  uid
}) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.UPDATE_PROFILE));
    var user = firebase.auth().currentUser;
    return user
      .updateProfile({
        displayName
      })
      .then(u =>
        db
          .collection("users")
          .doc(uid)
          .set({
            displayName,
            leftHanded,
            singleHandedBackhand
          })
      )
      .then(function() {
        dispatch({
          type: AppActionTypes.UPDATE_PROFILE_SUCCESS,
          user: {
            displayName,
            leftHanded,
            singleHandedBackhand
          }
        });
      })

      .catch(function(err) {
        dispatch({ type: AppActionTypes.API_ERROR, err });
      });
  };
}

export function signOut() {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNOUT));
    return firebase
      .auth()
      .signOut()
      .then(_ => dispatch({ type: AppActionTypes.SIGNOUT_SUCCESS }))
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function appLoad() {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.API_START));
    dispatch(apiStart(AppActionTypes.APP_LOAD));
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        db.collection("users")
          .doc(user.uid)
          .get()
          .then(function(doc) {
            if (doc.exists) {
              const userProfile = doc.data();
              console.log("user profile is ", userProfile);
              dispatch({
                type: AppActionTypes.SIGNIN_SUCCESS,
                user: {
                  ...user,
                  ...userProfile
                }
              });
            } else {
              dispatch({ type: AppActionTypes.SIGNIN_SUCCESS, user });
            }
          })
          .catch(function(error) {
            console.log("Error getting document:", error);
          });

        if (!user.emailVerified) {
          user
            .sendEmailVerification()
            .then(function() {
              console.log("Send email verification");
            })
            .catch(function(error) {
              console.log("cannot send email verification ");
            });
        }
      }
      dispatch({ type: AppActionTypes.APP_LOADED });
    });
  };
}

firebase.initializeApp(FBCONF);
const db = firebase.firestore();
export type AppAction =
  | AppLoadAction
  | AppLoadedAction
  | UpdateProfileAction
  | UpdateProfileSuccessAction
  | ApiStartAction
  | ApiEndAction
  | ApiErrorAction
  | SignInSuccessAction
  | SignOutSuccessAction
  | SignUpSuccessAction;
