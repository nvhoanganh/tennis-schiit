import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ISignInModel } from "../models";
import { IAction } from '@tennis-score/redux';


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
    return firebase
      .auth()
      .signInWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(apiEnd());
        dispatch({ type: AppActionTypes.SIGNIN_SUCCESS, user: user.user });
      })
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function signUp({ email, password }: ISignInModel) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNUP));
    firebase
      .auth()
      .createUserWithEmailAndPassword(email, password)
      .then(user => {
        dispatch(apiEnd());
        dispatch({ type: AppActionTypes.SIGNUP_SUCCESS, user: user.user });
      })
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function updateProfile({
  displayName,
  leftHanded,
  singleHandedBackhand,
  uid,
  history
}) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.UPDATE_PROFILE));
    var user = firebase.auth().currentUser;
    return user
      .updateProfile({
        displayName
      })
      .then(u =>
        firebase
          .firestore()
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
        history.push("/home");
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
    dispatch(apiStart(AppActionTypes.APP_LOAD));
    return firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        dispatch({ type: AppActionTypes.APP_LOADED });
        return;
      }

      // send email verification
      if (!user.emailVerified) {
        user
          .sendEmailVerification()
          .then(function() {
            console.log("Sent email verification");
          })
          .catch(function(error) {
            console.log("cannot send email verification", error);
          });
      }

      // get additional details from firestore
      firebase
        .firestore()
        .collection("users")
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
            // uer has not updated the profile
            dispatch({ type: AppActionTypes.SIGNIN_SUCCESS, user });
          }
          // dispatch apploaded last
          dispatch({ type: AppActionTypes.APP_LOADED });
        })
        .catch(function(error) {
          dispatch({ type: AppActionTypes.API_ERROR, error });
          dispatch(apiEnd());
        });
    });
  };
}

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
