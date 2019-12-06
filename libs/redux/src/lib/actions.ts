import { IScore, IGroup, IPlayer } from "./models";
export enum AppActionTypes {
  LAST_API_ERROR = "LAST_API_ERROR",
  API_START = "API_START",
  API_END = "API_END",

  LOAD_SCORE_SUCCESS = "LOAD_SCORE_SUCCESS",

  ADD_SCORE = "ADD_SCORE",
  DELETE_SCORE = "DELETE_SCORE",
  UPDATE_SCORE = "UPDATE_SCORE",

  LOAD_GROUP_SUCCESS = "LOAD_GROUP_SUCCESS",

  ADD_GROUP = "ADD_GROUP",
  DELETE_GROUP = "DELETE_GROUP",
  UPDATE_GROUP = "UPDATE_GROUP",

  LOAD_PLAYER_SUCCESS = "LOAD_PLAYER_SUCCESS",

  ADD_PLAYER = "CREATE_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",
  ADD_PLAYER_TO_GROUP = "ADD_PLAYER_TO_GROUP",
  UPDATE_PLAYER = "UPDATE_PLAYER",
  REMOVE_PLAYER = "REMOVE_PLAYER"
}
export interface IAction {
  type: string;
}

// actions
export class AddScoreAction implements IAction {
  readonly type = AppActionTypes.ADD_SCORE;
  constructor(public score: IScore) {}
}
export class DeleteScoreAction implements IAction {
  readonly type = AppActionTypes.DELETE_SCORE;
  constructor(public id: string) {}
}
export class UpdateScoreAction implements IAction {
  readonly type = AppActionTypes.UPDATE_SCORE;
  constructor(public score: IScore) {}
}
export class AddGroupAction implements IAction {
  readonly type = AppActionTypes.ADD_GROUP;
  constructor(public group: IGroup) {}
}
export class UpdateGroupAction implements IAction {
  readonly type = AppActionTypes.UPDATE_GROUP;
  constructor(public group: IGroup) {}
}
export class DeleteGroupAction implements IAction {
  readonly type = AppActionTypes.DELETE_GROUP;
  constructor(public id: string) {}
}
export class InvitePlayerToGroupAction implements IAction {
  readonly type = AppActionTypes.ADD_PLAYER_TO_GROUP;
  constructor(public playerId: string, public groupId: string) {}
}
export class AddPlayerAction implements IAction {
  readonly type = AppActionTypes.ADD_PLAYER;
  constructor(public player: IPlayer) {}
}
export class UpdatePlayerAction implements IAction {
  readonly type = AppActionTypes.UPDATE_PLAYER;
  constructor(public player: IPlayer) {}
}
export class RemovePlayerAction implements IAction {
  readonly type = AppActionTypes.REMOVE_PLAYER;
  constructor(public playerId: string) {}
}

export class LoadScoresSuccessAction implements IAction {
  readonly type = AppActionTypes.LOAD_SCORE_SUCCESS;
  constructor(public scores: { [scoreId: string]: IScore }) {}
}

export class LoadGroupsSuccessAction implements IAction {
  readonly type = AppActionTypes.LOAD_GROUP_SUCCESS;
  constructor(public groups: { [groupId: string]: IGroup }) {}
}

export class LoadPlayersSuccessAction implements IAction {
  readonly type = AppActionTypes.LOAD_PLAYER_SUCCESS;
  constructor(public players: { [playerId: string]: IPlayer }) {}
}
export class ApiStartAction implements IAction {
  readonly type = AppActionTypes.API_START;
}
export class ApiEndAction implements IAction {
  readonly type = AppActionTypes.API_END;
}
export class LastApiErrorAction implements IAction {
  readonly type = AppActionTypes.LAST_API_ERROR;
  constructor(public error: any) {}
}

// action creators
export function addScore(score: IScore): AddScoreAction {
  return { type: AppActionTypes.ADD_SCORE, score };
}

export function deleteScore(id: string): DeleteScoreAction {
  return { type: AppActionTypes.DELETE_SCORE, id };
}

export function updateScore(score: IScore): UpdateScoreAction {
  return { type: AppActionTypes.UPDATE_SCORE, score };
}

export function addGroup(group: IGroup): AddGroupAction {
  return { type: AppActionTypes.ADD_GROUP, group };
}

export function deleteGroup(id: string): DeleteGroupAction {
  return { type: AppActionTypes.DELETE_GROUP, id };
}

export function updateGroup(group: IGroup): UpdateGroupAction {
  return { type: AppActionTypes.UPDATE_GROUP, group };
}
export function invitePlayerToGroup(
  groupId: string,
  playerId: string
): InvitePlayerToGroupAction {
  return { type: AppActionTypes.ADD_PLAYER_TO_GROUP, groupId, playerId };
}
export function removePlayer(playerId: string): RemovePlayerAction {
  return { type: AppActionTypes.REMOVE_PLAYER, playerId };
}
export function addPlayer(player: IPlayer): AddPlayerAction {
  return { type: AppActionTypes.ADD_PLAYER, player };
}

// thunks
export function loadScores() {
  return dispatch => {
    dispatch(<ApiStartAction>{ type: AppActionTypes.API_START });
    return delay(2000).then(_ => {
      dispatch(<ApiEndAction>{ type: AppActionTypes.API_END });
      dispatch(<LoadScoresSuccessAction>{
        type: AppActionTypes.LOAD_SCORE_SUCCESS
      });
    });
  };
}
export function loadPlayers() {
  return dispatch => {
    dispatch(<ApiStartAction>{ type: AppActionTypes.API_START });
    return delay(2000).then(_ => {
      dispatch(<ApiEndAction>{ type: AppActionTypes.API_END });
      dispatch(<LoadPlayersSuccessAction>{
        type: AppActionTypes.LOAD_PLAYER_SUCCESS,
        players: {
          "234234": null
        }
      });
    });
  };
}
export function loadGroups() {
  return (dispatch, getState) => {
    dispatch(new ApiStartAction());
    console.log(`current state`, getState());
    return delay(2000).then(_ => {
      dispatch({ type: AppActionTypes.API_END });
      dispatch({
        type: AppActionTypes.LOAD_SCORE_SUCCESS,
        scores: {
          "234234": null
        }
      });
    });
  };
}

export type AppAction =
  | AddScoreAction
  | UpdateScoreAction
  | DeleteScoreAction
  | LoadScoresSuccessAction
  | LoadGroupsSuccessAction
  | LoadPlayersSuccessAction
  | AddGroupAction
  | UpdateGroupAction
  | DeleteGroupAction
  | InvitePlayerToGroupAction
  | AddPlayerAction
  | ApiStartAction
  | LastApiErrorAction
  | ApiEndAction
  | RemovePlayerAction;

function delay(duration): Promise<void> {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve();
    }, duration);
  });
}
