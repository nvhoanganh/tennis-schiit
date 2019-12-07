import { IPlayer } from "../models";
import { apiStart, apiEnd, apiError } from "./appActions";
import { IAction, delay, arrayToObject } from "../utils";
import { Mocked_Players } from "@tennis-score/api-interfaces";
export enum PlayerActionTypes {
  LOAD_PLAYER = "LOAD_PLAYER",
  LOAD_PLAYER_SUCCESS = "LOAD_PLAYER_SUCCESS",

  ADD_PLAYER = "CREATE_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",

  UPDATE_PLAYER = "UPDATE_PLAYER",
  REMOVE_PLAYER = "REMOVE_PLAYER"
}
export interface IAction {
  type: string;
}

// actions
export class AddPlayerAction implements IAction {
  readonly type = PlayerActionTypes.ADD_PLAYER;
  constructor(public player: IPlayer) {}
}
export class UpdatePlayerAction implements IAction {
  readonly type = PlayerActionTypes.UPDATE_PLAYER;
  constructor(public player: IPlayer) {}
}
export class RemovePlayerAction implements IAction {
  readonly type = PlayerActionTypes.REMOVE_PLAYER;
  constructor(public playerId: string) {}
}

export class LoadPlayersSuccessAction implements IAction {
  readonly type = PlayerActionTypes.LOAD_PLAYER_SUCCESS;
  constructor(public players: { [playerId: string]: IPlayer }) {}
}


export function removePlayer(playerId: string): RemovePlayerAction {
  return { type: PlayerActionTypes.REMOVE_PLAYER, playerId };
}
export function addPlayer(player: IPlayer): AddPlayerAction {
  return { type: PlayerActionTypes.ADD_PLAYER, player };
}

// thunks
export function loadPlayers() {
  return dispatch => {
    dispatch(apiStart(PlayerActionTypes.LOAD_PLAYER));
    return delay(2000)
      .then(_ => {
        dispatch(apiEnd());
        dispatch(<LoadPlayersSuccessAction>{
          type: PlayerActionTypes.LOAD_PLAYER_SUCCESS,
          players: arrayToObject(Mocked_Players)
        });
      })
      .catch(e => dispatch(apiError(PlayerActionTypes.LOAD_PLAYER, e)));
  };
}

export type PlayerAction =
  | LoadPlayersSuccessAction
  | AddPlayerAction
  | RemovePlayerAction;
