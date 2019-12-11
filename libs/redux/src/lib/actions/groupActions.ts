import { IGroup } from "../models";
import { apiEnd, apiStart, apiError } from "./appActions";
import { IAction, delay, arrayToObject } from "../utils";
import { Group, Mocked_Groups } from "@tennis-score/api-interfaces";
export enum GroupActionTypes {
  LOAD_GROUP = "LOAD_GROUP",
  LOAD_GROUP_FAILED = "LOAD_GROUP_FAILED",
  LOAD_GROUP_SUCCESS = "LOAD_GROUP_SUCCESS",

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
  readonly type = GroupActionTypes.LOAD_GROUP_SUCCESS;
  constructor(public groups: { [groupId: string]: IGroup }) {}
}

// action creators
export function invitePlayerToGroup(
  groupId: string,
  playerId: string
): AddPlayerToGroupAction {
  return { type: GroupActionTypes.ADD_PLAYER_TO_GROUP, groupId, playerId };
}

export function addGroup(group: IGroup): AddGroupAction {
  return { type: GroupActionTypes.ADD_GROUP, group };
}

export function deleteGroup(id: string): DeleteGroupAction {
  return { type: GroupActionTypes.DELETE_GROUP, id };
}

export function updateGroup(group: IGroup): UpdateGroupAction {
  return { type: GroupActionTypes.UPDATE_GROUP, group };
}

const mapGroups = (data: Group): IGroup => {
  return {
    ...data,
    players: arrayToObject(data.players, x => x.playerId, x => x.joinDate)
  };
};

// thunks
export function loadGroups() {
  return dispatch => {
    dispatch(apiStart(GroupActionTypes.LOAD_GROUP));
    return delay(2000).then(_ => {
      dispatch(apiEnd());
      dispatch(<LoadGroupsSuccessAction>{
        type: GroupActionTypes.LOAD_GROUP_SUCCESS,
        groups: arrayToObject(
          Mocked_Groups.map(x => mapGroups(x)),
          x => x.groupId,
          x => x
        )
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
