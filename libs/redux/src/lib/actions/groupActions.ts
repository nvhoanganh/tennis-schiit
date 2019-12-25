import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";
import { GROUPS, IGroup, TOURNAMENTS } from "../models";
import { arrayToObject } from "../utils";
import { apiEnd, apiStart } from "./appActions";
import { IAction } from "@tennis-score/redux";
export enum GroupActionTypes {
  LOAD_GROUPS = "LOAD_GROUPS",
  LOAD_GROUPS_SUCCESS = "LOAD_GROUPS_SUCCESS",

  ADD_GROUP = "ADD_GROUP",

  ADD_TOURNAMENT = "ADD_TOURNAMENT",
  ADD_TOURNAMENT_SUCCESS = "ADD_TOURNAMENT_SUCCESS",

  DELETE_GROUP = "DELETE_GROUP",
  UPDATE_GROUP = "UPDATE_GROUP",

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
      console.log("groups already loaded");
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
        dispatch({ type: GroupActionTypes.DELETE_GROUP, id: groupId });
      });
  };
}
export function addTournament({
  groupId,
  startDate,
  endDate,
  description,
  double
}) {
  return (dispatch, getState) => {
    const newTour = firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .collection(TOURNAMENTS)
      .doc();

    dispatch(apiStart(GroupActionTypes.ADD_TOURNAMENT));
    return newTour
      .set({
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : "",
        description,
        double
      })
      .then(_ =>
        // duplicate data
        firebase
          .firestore()
          .collection(GROUPS)
          .doc(groupId)
          .update({
            currentTournament: newTour.id
          })
      )
      .then(doc => {
        dispatch(apiEnd());
        dispatch({
          type: GroupActionTypes.ADD_TOURNAMENT_SUCCESS,
          tournament: { id: newTour.id, groupId }
        });
      });
  };
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
      onwerName: user.displayName,
      played: 0,
      groupImage: "",
      players: [
        {
          joinDate: new Date(),
          email: user.email,
          name: user.displayName,
          userId: user.uid
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

    return newGroup
      .set(dat)
      .then(_ => newGroup.get())
      .then(d => {
        dispatch(apiEnd());
        dispatch(<AddGroupAction>{
          type: GroupActionTypes.ADD_GROUP,
          group: { groupId: newGroup.id, ...mapGroups(d.data()) }
        });
      });
  };
}

export type GroupAction =
  | AddPlayerToGroupAction
  | AddTournamentSuccess
  | LoadGroupsSuccessAction
  | AddGroupAction
  | UpdateGroupAction
  | DeleteGroupAction;
