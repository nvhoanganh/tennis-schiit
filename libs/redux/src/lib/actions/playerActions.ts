import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { IPlayer, USERS, GROUPS } from "../models";
import { apiEnd, apiStart } from "./appActions";
export enum PlayerActionTypes {
  LOAD_PLAYERS = "LOAD_PLAYERS",
  LOAD_PLAYERS_SUCCESS = "LOAD_PLAYERS_SUCCESS",

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
  readonly type = PlayerActionTypes.LOAD_PLAYERS_SUCCESS;
  constructor(public players: { [playerId: string]: IPlayer }) {}
}

export function removePlayer(playerId: string): RemovePlayerAction {
  return { type: PlayerActionTypes.REMOVE_PLAYER, playerId };
}
export function addPlayer(player: IPlayer): AddPlayerAction {
  return { type: PlayerActionTypes.ADD_PLAYER, player };
}

// thunks
export function loadPlayers(groupId: string) {
  return dispatch => {
    dispatch(apiStart(PlayerActionTypes.LOAD_PLAYERS));
    const group = firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId);

    const allPlayers = firebase
      .firestore()
      .collection(USERS)
      .get();

    Promise.all([group, allPlayers]).then(([g, users]) => {
      const allUsers = {};
      users.forEach(doc => {
        allUsers[doc.id] = {
          id: doc.id,
          ...doc.data()
        };
      });
      dispatch(apiEnd());
      dispatch(<LoadPlayersSuccessAction>{
        type: PlayerActionTypes.LOAD_PLAYERS_SUCCESS,
        players: allUsers
      });
    });
  };
}

export type PlayerAction =
  | LoadPlayersSuccessAction
  | AddPlayerAction
  | RemovePlayerAction;
