import { IAction } from "@tennis-score/redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ISignInModel } from "../models";

export enum AppActionTypes {
  API_ERROR = "LAST_API_ERROR",
  RESET_ERROR = "RESET_ERROR",
  API_START = "API_START",
  API_END = "API_END",

  APP_LOAD = "APP_LOAD",
  APP_LOADED = "APP_LOADED",
  APP_LOAD_FAILED = "APP_LOAD_FAILED",

  SIGNIN = "SIGNIN",
  SIGNIN_SUCCESS = "SIGNIN_SUCCESS",

  RESET_PASS = "RESET_PASS",
  RESET_PASS_SUCCESS = "RESET_PASS_SUCCESS",
  RESET_PASS_FAILED = "RESET_PASS_FAILED",

  SIGNOUT = "SIGNOUT",
  SIGNOUT_SUCCESS = "SIGNOUT_SUCCESS",

  SIGNUP = "SIGNUP",
  SIGNUP_SUCCESS = "SIGNUP_SUCCESS",

  UPDATE_PROFILE = "UPDATE_PROFILE",
  UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS"
}

export class ApiStartAction implements IAction {
  readonly type = AppActionTypes.API_START;
  constructor(public action: string, public payload?: any) {}
}
export class AppLoadAction implements IAction {
  readonly type = AppActionTypes.APP_LOAD;
}
export class AppLoadedAction implements IAction {
  readonly type = AppActionTypes.APP_LOADED;
}
export class AppLoadFailedAction implements IAction {
  readonly type = AppActionTypes.APP_LOAD_FAILED;
  constructor(public action: string, public error: any) {}
}
export class ApiEndAction implements IAction {
  readonly type = AppActionTypes.API_END;
}
export class ResetErrorAction implements IAction {
  readonly type = AppActionTypes.RESET_ERROR;
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

export function apiStart(action: string, payload?: any): ApiStartAction {
  return { type: AppActionTypes.API_START, action, payload };
}
export function apiEnd(): ApiEndAction {
  return { type: AppActionTypes.API_END };
}
export function resetError() {
  return { type: AppActionTypes.RESET_ERROR };
}
export function apiError(action: string, err: any): ApiErrorAction {
  return { type: AppActionTypes.API_ERROR, action, err };
}

// thunks

export function signIn({ email, password, isGmail, isFacebook }) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.SIGNIN));
    if (isGmail) {
      const provider = new firebase.auth.GoogleAuthProvider();
      return firebase.auth().signInWithRedirect(provider);
    }
    if (isFacebook) {
      const provider = new firebase.auth.FacebookAuthProvider();
      return firebase.auth().signInWithRedirect(provider);
    }
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

export function resetPassword(email) {
  return dispatch => {
    dispatch(apiStart(AppActionTypes.RESET_PASS));
    return firebase
      .auth()
      .sendPasswordResetEmail(email)
      .then(_ => {
        dispatch(apiEnd());
        dispatch({ type: AppActionTypes.RESET_PASS_SUCCESS });
        window.history.back();
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
  avatar,
  uid,
  history,
  userDetails
}) {
  return async dispatch => {
    dispatch(apiStart(AppActionTypes.UPDATE_PROFILE));
    // get blob from File API
    const blob = avatar ? await (await fetch(avatar)).blob() : null;
    let avatarUrl = "";
    if (blob) {
      console.log("new avatar uploaded");
      var storageRef = firebase.storage().ref();
      var imageRef = await storageRef
        .child(`images/avatar_${uid}.png`)
        .put(blob);
      avatarUrl = imageRef.metadata.fullPath;
    }
    var user = firebase.auth().currentUser;
    var userRef = firebase
      .firestore()
      .collection("users")
      .doc(uid);
    if (!(await userRef.get()).exists) {
      // create first
      await userRef.set({
        ...userDetails,
        ...(avatarUrl && { avatarUrl })
      });
    }

    // update
    return user
      .updateProfile({
        displayName
      })
      .then(_ =>
        userRef.update({
          ...userDetails,
          ...(avatarUrl && { avatarUrl })
        })
      )
      .then(function() {
        dispatch({
          type: AppActionTypes.UPDATE_PROFILE_SUCCESS,
          user: {
            displayName,
            avatarUrl,
            ...userDetails
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
    dispatch(apiStart(AppActionTypes.APP_LOAD));
    return firebase.auth().onAuthStateChanged(user => {
      if (!user) {
        dispatch({ type: AppActionTypes.APP_LOADED });
        return;
      }

      // send email verification
      // if (!user.emailVerified) {
      //   user
      //     .sendEmailVerification()
      //     .then(function() {
      //       console.log("Sent email verification");
      //     })
      //     .catch(function(error) {
      //       console.log("cannot send email verification", error);
      //     });
      // }

      // get additional details from firestore
      firebase
        .firestore()
        .collection("users")
        .doc(user.uid)
        .get()
        .then(function(doc) {
          if (doc.exists) {
            const userProfile = doc.data();
            dispatch({
              type: AppActionTypes.SIGNIN_SUCCESS,
              user: {
                ...user,
                loaded: true,
                ...userProfile,
                profileUpdated: true
              }
            });
          } else {
            dispatch({
              type: AppActionTypes.SIGNIN_SUCCESS,
              user: { ...user, loaded: true, profileUpdated: false }
            });
          }
          // dispatch apploaded last
          dispatch({ type: AppActionTypes.APP_LOADED });
        })
        .catch(function(error) {
          dispatch({ type: AppActionTypes.APP_LOAD_FAILED, error });
          dispatch(apiEnd());
        });
    });
  };
}

export type AppAction =
  | AppLoadAction
  | AppLoadedAction
  | AppLoadFailedAction
  | UpdateProfileAction
  | UpdateProfileSuccessAction
  | ApiStartAction
  | ApiEndAction
  | ApiErrorAction
  | ResetErrorAction
  | SignInSuccessAction
  | SignOutSuccessAction
  | SignUpSuccessAction;
