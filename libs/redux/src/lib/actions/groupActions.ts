import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { GROUPS, IGroup } from "../models";
import { arrayToObject } from "../utils";
import { apiEnd, apiStart } from "./appActions";
import { IAction } from "@tennis-score/redux";
export enum GroupActionTypes {
  LOAD_GROUPS = "LOAD_GROUPS",
  LOAD_GROUPS_SUCCESS = "LOAD_GROUPS_SUCCESS",

  ADD_GROUP = "ADD_GROUP",
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
  constructor(public group: IGroup) {}
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

export function deleteGroup(id: string): DeleteGroupAction {
  return { type: GroupActionTypes.DELETE_GROUP, id };
}

export function updateGroup(group: IGroup): UpdateGroupAction {
  return { type: GroupActionTypes.UPDATE_GROUP, group };
}

const mapGroups = (data): IGroup => {
  return {
    ...data,
    players: arrayToObject(data.players, x => x.playerId, x => x.joinDate)
  };
};

// thunks
export function loadGroups() {
  return (dispatch, getState) => {
    const { groups } = getState();
    if (Object.keys(groups).length > 0) {
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

export function addGroup({ name, description }) {
  return (dispatch, getState) => {
    const {
      app: { user }
    } = getState();

    const dat = {
      name,
      description,
      createdOn: new Date(),
      owner: user.uid,
      played: 0,
      players: [
        {
          joinDate: new Date(),
          name: user.displayName,
          playerId: user.uid
        }
      ]
    };
    console.log("adding group", dat);
    dispatch(apiStart(GroupActionTypes.ADD_GROUP));
    return firebase
      .firestore()
      .collection(GROUPS)
      .add(dat)
      .then(d => {
        dispatch(apiEnd());
        dispatch(<AddGroupAction>{
          type: GroupActionTypes.ADD_GROUP,
          group: <any>d
        });
      });
  };
}

export type GroupAction =
  | AddPlayerToGroupAction
  | LoadGroupsSuccessAction
  | AddGroupAction
  | UpdateGroupAction
  | DeleteGroupAction;
