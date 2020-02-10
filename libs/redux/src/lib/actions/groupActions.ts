import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import geohash from "ngeohash";
import "firebase/storage";
import { GROUPS, IGroup, TOURNAMENTS, USERS, STATS } from "../models";
import { arrayToObject, urlB64ToUint8Array, isPushEnabled } from "../utils";
import { apiEnd, apiStart, AppActionTypes } from "./appActions";
import { IAction } from "@tennis-score/redux";
import { loadLeaderboard } from "./leaderboardActions";
export enum GroupActionTypes {
  LOAD_GROUPS = "LOAD_GROUPS",
  LOAD_GROUPS_SUCCESS = "LOAD_GROUPS_SUCCESS",

  ADD_GROUP = "ADD_GROUP",

  ADD_TOURNAMENT = "ADD_TOURNAMENT",
  ADD_TOURNAMENT_SUCCESS = "ADD_TOURNAMENT_SUCCESS",

  DELETE_GROUP = "DELETE_GROUP",
  UPDATE_GROUP = "UPDATE_GROUP",

  JOIN_GROUP = "JOIN_GROUP",
  JOIN_GROUP_SUCCESS = "JOIN_GROUP_SUCCESS",

  REJECT_JOIN_GROUP = "REJECT_JOIN_GROUP",
  REJECT_JOIN_GROUP_SUCCESS = "REJECT_JOIN_GROUP_SUCCESS",

  APPROVE_JOIN_GROUP = "APPROVE_JOIN_GROUP",
  APPROVE_JOIN_GROUP_SUCCESS = "APPROVE_JOIN_GROUP_SUCCESS",

  CANCEL_JOIN_GROUP = "CANCEL_JOIN_GROUP",
  CANCEL_JOIN_GROUP_SUCCESS = "CANCEL_JOIN_GROUP_SUCCESS",

  ADD_PLAYER_TO_GROUP = "ADD_PLAYER_TO_GROUP"
}

// actions
export class AddPlayerToGroupAction implements IAction {
  readonly type = GroupActionTypes.ADD_PLAYER_TO_GROUP;
  constructor(public playerId: string, public groupId: string) {}
}

export class AddGroupAction implements IAction {
  readonly type = GroupActionTypes.ADD_GROUP;
  constructor(public group: any) {}
}

export class JoinGroupAction implements IAction {
  readonly type = GroupActionTypes.JOIN_GROUP;
  constructor(public group: any) {}
}
export class JoinGroupSuccessAction implements IAction {
  readonly type = GroupActionTypes.JOIN_GROUP_SUCCESS;
  constructor(public groupId: string, public user: any) {}
}

export class CancelJoinGroupAction implements IAction {
  readonly type = GroupActionTypes.CANCEL_JOIN_GROUP;
  constructor(public group: any) {}
}
export class CancelJoinGroupSuccessAction implements IAction {
  readonly type = GroupActionTypes.CANCEL_JOIN_GROUP_SUCCESS;
  constructor(public groupId: string, public user: any) {}
}

export class AddTournamentSuccess implements IAction {
  readonly type = GroupActionTypes.ADD_TOURNAMENT_SUCCESS;
  constructor(public tournament: any) {}
}
export class UpdateGroupAction implements IAction {
  readonly type = GroupActionTypes.UPDATE_GROUP;
  constructor(public group: IGroup) {}
}
export class DeleteGroupAction implements IAction {
  readonly type = GroupActionTypes.DELETE_GROUP;
  constructor(public id: string) {}
}

export class LoadGroupsSuccessAction implements IAction {
  readonly type = GroupActionTypes.LOAD_GROUPS_SUCCESS;
  constructor(public groups: { [groupId: string]: IGroup }) {}
}

export class RejectJoinRequestAction implements IAction {
  readonly type = GroupActionTypes.REJECT_JOIN_GROUP;
  constructor(public payload: any) {}
}
export class RejectJoinRequestSuccessAction implements IAction {
  readonly type = GroupActionTypes.REJECT_JOIN_GROUP_SUCCESS;
  constructor(public payload: any) {}
}

// action creators
export function invitePlayerToGroup(
  groupId: string,
  playerId: string
): AddPlayerToGroupAction {
  return { type: GroupActionTypes.ADD_PLAYER_TO_GROUP, groupId, playerId };
}

export function updateGroup(group: IGroup): UpdateGroupAction {
  return { type: GroupActionTypes.UPDATE_GROUP, group };
}

const mapGroups = (data): IGroup => {
  return {
    ...data,
    players: arrayToObject(data.players, x => x.userId, x => x)
  };
};

// thunks
export function loadGroups(reload = false) {
  return (dispatch, getState) => {
    const { groups } = getState();
    if (Object.keys(groups).length > 0 && !reload) {
      return Promise.resolve();
    }

    dispatch(apiStart(GroupActionTypes.LOAD_GROUPS));
    return firebase
      .firestore()
      .collection(GROUPS)
      .get()
      .then(querySnapshot => {
        const data = arrayToObject(
          querySnapshot.docs,
          x => x.id,
          x => ({
            groupId: x.id,
            ...mapGroups(x.data())
          })
        );

        dispatch(apiEnd());
        dispatch(<LoadGroupsSuccessAction>{
          type: GroupActionTypes.LOAD_GROUPS_SUCCESS,
          groups: data
        });
      });
  };
}

export function deleteGroup(groupId) {
  return (dispatch, getState) => {
    dispatch(apiStart(GroupActionTypes.DELETE_GROUP));
    return firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .delete()
      .then(_ => {
        dispatch(apiEnd());
        dispatch(loadGroups(true));
        dispatch({ type: GroupActionTypes.DELETE_GROUP, id: groupId });
      });
  };
}

export function joinGroup(groupId) {
  return (dispatch, getState) => {
    const {
      app: {
        user: { uid, email, displayName }
      }
    } = getState();
    dispatch(apiStart(GroupActionTypes.JOIN_GROUP));
    const user = { uid, email, displayName, requestDate: new Date() };
    return firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .update({
        [`pendingJoinRequests.${uid}`]: user
      })
      .then(_ => {
        dispatch(apiEnd());
        dispatch(<JoinGroupSuccessAction>{
          type: GroupActionTypes.JOIN_GROUP_SUCCESS,
          groupId: groupId,
          user
        });
      });
  };
}

export function rejectJoinRequest(target, groupId) {
  return (dispatch, getState) => {
    const {
      app: {
        user: { uid, email, displayName }
      }
    } = getState();
    dispatch(apiStart(GroupActionTypes.REJECT_JOIN_GROUP));
    const user = { uid, email, displayName, requestDate: new Date() };
    // delete from pending first
    return firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .update({
        [`pendingJoinRequests.${target.uid}`]: firebase.firestore.FieldValue.delete()
      })
      .then(_ =>
        firebase
          .firestore()
          .collection(GROUPS)
          .doc(groupId)
          .update({
            [`rejectedJoinRequests.${target.uid}`]: {
              ...target,
              rejectedBy: user
            }
          })
      )
      .then(_ => {
        dispatch(apiEnd());
        dispatch(<RejectJoinRequestSuccessAction>{
          type: GroupActionTypes.REJECT_JOIN_GROUP_SUCCESS,
          payload: {
            groupId,
            target
          }
        });
      });
  };
}

export function approveJoinRequest(target, groupId, createAs) {
  return async (dispatch, getState) => {
    const {
      app: {
        user: { uid }
      }
    } = getState();

    const groupRef = firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId);

    const userRef = firebase
      .firestore()
      .collection(USERS)
      .doc(target.uid);

    dispatch(apiStart(GroupActionTypes.APPROVE_JOIN_GROUP));

    // delete from pending first
    return groupRef
      .update({
        [`pendingJoinRequests.${target.uid}`]: firebase.firestore.FieldValue.delete()
      })
      .then(_ =>
        userRef.update({
          [`groups.${groupId}`]: true
        })
      )
      .then(_ => {
        // add player
        if (createAs === null) {
          return groupRef.update({
            players: firebase.firestore.FieldValue.arrayUnion({
              email: target.email,
              name: target.displayName,
              userId: target.uid,
              linkedplayerId: target.uid,
              avatarUrl: target.avatarUrl || "",
              joinDate: new Date(),
              addedBy: uid
            })
          });
        } else {
          return groupRef.get().then(d => {
            const newPlayersList = d.data().players.map(x =>
              x.userId === createAs.id
                ? {
                    ...x,
                    email: target.email,
                    name: target.displayName,
                    linkedplayerId: target.uid,
                    addedBy: uid
                  }
                : x
            );
            return groupRef.update({
              players: newPlayersList
            });
          });
        }
      })
      .then(_ => {
        dispatch(apiEnd());
        dispatch(loadGroups(true));
        dispatch(loadLeaderboard(groupId));
      });
  };
}

export function cancelJoinGroup(groupId) {
  return (dispatch, getState) => {
    const {
      app: {
        user: { uid, email, displayName }
      }
    } = getState();
    dispatch(apiStart(GroupActionTypes.CANCEL_JOIN_GROUP));
    const user = { uid, email, displayName, requestDate: new Date() };
    return firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .update({
        [`pendingJoinRequests.${uid}`]: firebase.firestore.FieldValue.delete()
      })
      .then(_ => {
        dispatch(apiEnd());
        dispatch(<CancelJoinGroupSuccessAction>{
          type: GroupActionTypes.CANCEL_JOIN_GROUP_SUCCESS,
          groupId: groupId,
          user
        });
      });
  };
}

export function addTournament({
  
  group,
  tournamentId,
  startDate,
  prize,
  description,
  sortBy
}) {
  return async (dispatch, getState) => {
    dispatch(apiStart(GroupActionTypes.ADD_TOURNAMENT));

    const groupRef = firebase
      .firestore()
      .collection(GROUPS)
      .doc(group.groupId);

    // update tournament
    const newTour = !tournamentId
      ? groupRef.collection(TOURNAMENTS).doc()
      : groupRef.collection(TOURNAMENTS).doc(tournamentId);

    if (!tournamentId) {
      await newTour.set({
        startDate: new Date(startDate),
        prize,
        sortBy,
        description
      });
    } else {
      await newTour.update({
        startDate: new Date(startDate),
        prize,
        sortBy,
        description
      });
    }

    if (!tournamentId) {
      await groupRef.update({
        currentTournament: newTour.id
      });

      if (group.currentTournament) {
        await groupRef
          .collection(TOURNAMENTS)
          .doc(group.currentTournament)
          .update({
            endDate: new Date()
          });
      }
    }

    dispatch(apiEnd());
    dispatch({
      type: GroupActionTypes.ADD_TOURNAMENT_SUCCESS,
      tournament: { id: newTour.id, groupId: group.groupId }
    });
    return Promise.resolve();
  };
}

export function editGroup({
  group,
  name,
  description,
  location,
  locationLongLat,
  photo
}) {
  return async (dispatch, getState) => {
    const {
      app: { user }
    } = getState();

    let dat = {
      name,
      description,
      location,
      locationLongLat,
      hashedLocation: geohash.encode(locationLongLat.lat, locationLongLat.lng)
    };

    dispatch(apiStart(GroupActionTypes.UPDATE_GROUP));
    var editGroup = firebase
      .firestore()
      .collection(GROUPS)
      .doc(group.groupId);

    if (photo) {
      debugger;
      var storageRef = firebase.storage().ref();
      var imageRef = await storageRef
        .child(`images/${editGroup.id}-${photo.name}`)
        .put(photo);
      dat = { ...(<any>dat), groupImage: imageRef.metadata.fullPath };
    }

    return editGroup.update(dat).then(_ => {
      dispatch(apiEnd());
      dispatch(loadGroups(true));
    });
  };
}

export function checkFileExist(url) {
  var storageRef = firebase.storage().refFromURL(url);
  return storageRef.getDownloadURL();
}
export function addGroup({
  name,
  description,
  location,
  locationLongLat,
  photo
}) {
  return async (dispatch, getState) => {
    const {
      app: { user }
    } = getState();

    let dat = {
      name,
      description,
      createdOn: new Date(),
      owner: user.uid,
      location,
      locationLongLat,
      hashedLocation: geohash.encode(locationLongLat.lat, locationLongLat.lng),
      onwerName: user.displayName,
      played: 0,
      groupImage: "",
      players: [
        {
          joinDate: new Date(),
          email: user.email,
          name: user.displayName,
          userId: user.uid,
          avatarUrl: user.avatarUrl || "",
          linkedplayerId: user.uid
        }
      ]
    };

    dispatch(apiStart(GroupActionTypes.ADD_GROUP));
    var newGroup = firebase
      .firestore()
      .collection(GROUPS)
      .doc();

    if (photo) {
      var storageRef = firebase.storage().ref();
      var imageRef = await storageRef
        .child(`images/${newGroup.id}-${photo.name}`)
        .put(photo);
      dat = { ...dat, groupImage: imageRef.metadata.fullPath };
    }

    // set user group membership
    await firebase
      .firestore()
      .collection(USERS)
      .doc(user.uid)
      .update({
        [`groups.${newGroup.id}`]: true
      });
    return newGroup.set(dat).then(_ => {
      dispatch(apiEnd());
      dispatch(loadGroups(true));
    });
  };
}

export function getStats(groupId, tourId) {
  return firebase
    .firestore()
    .collection(GROUPS)
    .doc(groupId)
    .collection(TOURNAMENTS)
    .doc(tourId)
    .collection(STATS)
    .get()
    .then(x => x.docs.map(y => y.data()));
}


export type GroupAction =
  | AddPlayerToGroupAction
  | AddTournamentSuccess
  | LoadGroupsSuccessAction
  | AddGroupAction
  | JoinGroupSuccessAction
  | CancelJoinGroupSuccessAction
  | RejectJoinRequestAction
  | RejectJoinRequestSuccessAction
  | UpdateGroupAction
  | DeleteGroupAction;
