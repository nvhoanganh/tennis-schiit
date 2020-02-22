/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAction } from "@tennis-score/redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { ISignInModel, USERS, GROUPS } from "../models";
import { isPushEnabled, urlB64ToUint8Array } from "../utils";
import ReactGA from "react-ga";

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
  SIGNUP_FAILED = "SIGNUP_FAILED",

  UPDATE_PROFILE = "UPDATE_PROFILE",
  UPDATE_PROFILE_SUCCESS = "UPDATE_PROFILE_SUCCESS",

  GET_NOTIFICATION_SUB = "GET_NOTIFICATION_SUB",
  GET_NOTIFICATION_SUB_SUCCESS = "GET_NOTIFICATION_SUB_SUCCESS",

  PWA_REG = "SET_PWA_REG"
}
export class AppRegisterPwaHandle implements IAction {
  readonly type = AppActionTypes.PWA_REG;
  constructor(public registration: any) {}
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

export class GetNotificationSubSuccess implements IAction {
  readonly type = AppActionTypes.GET_NOTIFICATION_SUB_SUCCESS;
  constructor(public action: string) {}
}

export class SignInSuccessAction implements IAction {
  readonly type = AppActionTypes.SIGNIN_SUCCESS;
  constructor(public user: any) {}
}
export class SignUpSuccessAction implements IAction {
  readonly type = AppActionTypes.SIGNUP_SUCCESS;
  constructor(public user: any) {}
}
export class SignUpFailedAction implements IAction {
  readonly type = AppActionTypes.SIGNUP_FAILED;
  constructor(public err: any) {}
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

export function registerPwaHandle(registration): AppRegisterPwaHandle {
  return { type: AppActionTypes.PWA_REG, registration };
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
      .then(() => {
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
      .catch(err => {
        dispatch({ type: AppActionTypes.API_ERROR, err });
        dispatch({ type: AppActionTypes.SIGNUP_FAILED, err });
      });
  };
}

export function updateProfile({ displayName, avatar, uid, userDetails }) {
  return async dispatch => {
    dispatch(apiStart(AppActionTypes.UPDATE_PROFILE));
    // get blob from File API
    const blob = avatar ? await (await fetch(avatar)).blob() : null;
    let avatarUrl = "";
    if (blob) {
      const storageRef = firebase.storage().ref();
      const imageRef = await storageRef
        .child(`images/avatar_${uid}.png`)
        .put(blob);
      avatarUrl = imageRef.metadata.fullPath;
    }
    const user = firebase.auth().currentUser;
    const userRef = firebase
      .firestore()
      .collection(USERS)
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
      .then(() =>
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
      .then(() => dispatch({ type: AppActionTypes.SIGNOUT_SUCCESS }))
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
      // Google Analytics
      ReactGA.set({
        userId: user.uid
      });

      firebase
        .firestore()
        .collection(USERS)
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

export function turnOffWebPushSubForGroup(uid, groupId) {
  return firebase
    .firestore()
    .collection(GROUPS)
    .doc(groupId)
    .update({
      [`webPush.${uid}`]: false
    });
}
export function getWebPushSub(uid, reg, groupId) {
  const publicKey =
    "BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U";

  if (isPushEnabled()) {
    console.log("SW:registering Webpush", new Date());
    const subscribeOptions = {
      userVisibleOnly: true,
      applicationServerKey: urlB64ToUint8Array(publicKey)
    };
    return reg.pushManager.subscribe(subscribeOptions).then(sub => {
      console.log("SW:Received PushSubscription: ", sub);
      console.log("Marked Web Pushed Enabled for this user", uid);
      console.log("Update group Id web push", groupId);
      const batch = firebase.firestore().batch();
      batch.update(
        firebase
          .firestore()
          .collection(USERS)
          .doc(uid),
        {
          webPushEnabled: true
        }
      );
      batch.update(
        firebase
          .firestore()
          .collection(GROUPS)
          .doc(groupId),
        {
          [`webPush.${uid}`]: {
            data: JSON.stringify(sub),
            timestamp: new Date()
          }
        }
      );
      return batch.commit();
    });
  }
}

export function getWebPushSubAction(groupId) {
  return (dispatch, getState) => {
    const {
      app: {
        user: { uid },
        pwaHandle
      }
    } = getState();
    dispatch(apiStart(AppActionTypes.GET_NOTIFICATION_SUB));
    // delete from pending first
    return getWebPushSub(uid, pwaHandle, groupId).then(() => {
      dispatch(apiEnd());
      dispatch({
        type: AppActionTypes.GET_NOTIFICATION_SUB_SUCCESS
      } as GetNotificationSubSuccess);
    });
  };
}

export type AppAction =
  | AppRegisterPwaHandle
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
  | SignUpSuccessAction
  | SignUpFailedAction;
