/* eslint-disable @typescript-eslint/no-explicit-any */
import { IAction } from "@tennis-score/redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import geohash from "ngeohash";
import { GROUPS, IGroup, STATS, TOURNAMENTS, USERS } from "../models";
import { arrayToObject } from "../utils";
import { apiEnd, apiStart } from "./appActions";
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

  LEAVE_GROUP = "LEAVE_GROUP",
  LEAVE_GROUP_SUCCESS = "LEAVE_GROUP_SUCCESS",

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
export function loadGroups() {
  return dispatch => {
    return firebase
      .firestore()
      .collection(GROUPS)
      .onSnapshot(querySnapshot => {
        const data = arrayToObject(
          querySnapshot.docs,
          x => x.id,
          x => ({
            groupId: x.id,
            ...mapGroups(x.data())
          })
        );
        dispatch({
          type: GroupActionTypes.LOAD_GROUPS_SUCCESS,
          groups: data
        } as LoadGroupsSuccessAction);
      });
  };
}

export function deleteGroup(groupId) {
  return dispatch => {
    dispatch(apiStart(GroupActionTypes.DELETE_GROUP));
    return firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .delete()
      .then(() => {
        dispatch(apiEnd());
        dispatch({ type: GroupActionTypes.DELETE_GROUP, id: groupId });
      });
  };
}

export function joinGroup(groupId) {
  return (dispatch, getState) => {
    const {
      app: {
        user: { uid, email, displayName, avatarUrl }
      }
    } = getState();
    dispatch(apiStart(GroupActionTypes.JOIN_GROUP));
    const user = {
      uid,
      email,
      displayName,
      requestDate: new Date(),
      avatarUrl: avatarUrl || ""
    };
    console.log("joining user", user);
    return firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .update({
        [`pendingJoinRequests.${uid}`]: user
      })
      .then(() => {
        dispatch(apiEnd());
        dispatch({
          type: GroupActionTypes.JOIN_GROUP_SUCCESS,
          groupId: groupId,
          user
        } as JoinGroupSuccessAction);
      });
  };
}

export function leaveGroup(groupId) {
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
      .doc(uid);

    dispatch(apiStart(GroupActionTypes.LEAVE_GROUP));

    return userRef
      .update({
        [`groups.${groupId}`]: firebase.firestore.FieldValue.delete()
      })
      .then(() =>
        groupRef.get().then(d =>
          groupRef.update({
            players: d.data().players.map(x =>
              x.userId === uid
                ? {
                    ...x,
                    leftGroup: new Date()
                  }
                : x
            )
          })
        )
      )
      .then(() => {
        dispatch(apiEnd());
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
      .then(() =>
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
      .then(() => {
        dispatch(apiEnd());
        dispatch({
          type: GroupActionTypes.REJECT_JOIN_GROUP_SUCCESS,
          payload: {
            groupId,
            target
          }
        } as RejectJoinRequestSuccessAction);
      });
  };
}

export function approveJoinRequest(target, group, createAs) {
  return async (dispatch, getState) => {
    const {
      app: {
        user: { uid }
      }
    } = getState();

    const groupRef = firebase
      .firestore()
      .collection(GROUPS)
      .doc(group.groupId);

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
      .then(() =>
        userRef.update({
          [`groups.${group.groupId}`]: true
        })
      )
      .then(() => {
        // add new player
        if (group.players[target.uid] && group.players[target.uid].leftGroup) {
          // this is old player who left the group before, just need to remove
          // replace ghost player
          return groupRef.get().then(d => {
            const newPlayersList = d.data().players.map(x =>
              x.userId === target.uid
                ? {
                    ...x,
                    email: target.email,
                    name: target.displayName,
                    avatarUrl: target.avatarUrl || "",
                    linkedplayerId: target.uid,
                    addedBy: uid,
                    leftGroup: null
                  }
                : x
            );
            return groupRef.update({
              players: newPlayersList
            });
          });
        }

        if (createAs === null) {
          // add new player to the group
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
          // replace ghost player
          return groupRef.get().then(d => {
            const newPlayersList = d.data().players.map(x =>
              x.userId === createAs.id
                ? {
                    ...x,
                    email: target.email,
                    name: target.displayName,
                    avatarUrl: target.avatarUrl || "",
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
      .then(() => {
        dispatch(apiEnd());
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
      .then(() => {
        dispatch(apiEnd());
        dispatch({
          type: GroupActionTypes.CANCEL_JOIN_GROUP_SUCCESS,
          groupId: groupId,
          user
        } as CancelJoinGroupSuccessAction);
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
  return async dispatch => {
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
  return async dispatch => {
    let dat = {
      name,
      description,
      location,
      locationLongLat,
      hashedLocation: geohash.encode(locationLongLat.lat, locationLongLat.lng)
    };

    dispatch(apiStart(GroupActionTypes.UPDATE_GROUP));
    const editGroup = firebase
      .firestore()
      .collection(GROUPS)
      .doc(group.groupId);

    if (photo) {
      const storageRef = firebase.storage().ref();
      const imageRef = await storageRef
        .child(`images/${editGroup.id}-${photo.name}`)
        .put(photo);
      dat = { ...(dat as any), groupImage: imageRef.metadata.fullPath };
    }

    return editGroup.update(dat).then(() => {
      dispatch(apiEnd());
    });
  };
}

export function checkFileExist(url) {
  const storageRef = firebase.storage().refFromURL(url);
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
    const newGroup = firebase
      .firestore()
      .collection(GROUPS)
      .doc();

    if (photo) {
      const storageRef = firebase.storage().ref();
      const imageRef = await storageRef
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
    return newGroup.set(dat).then(() => {
      dispatch(apiEnd());
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
