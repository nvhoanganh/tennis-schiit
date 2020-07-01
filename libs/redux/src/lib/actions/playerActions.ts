import { IAction } from "@tennis-score/redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {
  GROUPS,
  IPlayer,
  PLAYERS,
  SCORES,
  STATS,
  TOURNAMENTS,
  USERS
} from "../models";
import { apiEnd, apiStart } from "./appActions";
import { pipe, reverse, sortBy, prop } from "ramda";
export enum PlayerActionTypes {
  LOAD_PLAYERS = "LOAD_PLAYERS",
  LOAD_PLAYERS_SUCCESS = "LOAD_PLAYERS_SUCCESS",

  ADD_PLAYER = "CREATE_PLAYER",
  INVITE_PLAYER = "INVITE_PLAYER",

  UPDATE_PLAYER = "UPDATE_PLAYER",
  REMOVE_PLAYER = "REMOVE_PLAYER",

  LOAD_STATS_SUCCESS = "LOAD_STATS_SUCCESS"
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
export function addPlayer({ name, email, groupId, group }) {
  return dispatch => {
    dispatch(apiStart(PlayerActionTypes.ADD_PLAYER));
    return firebase
      .firestore()
      .collection(PLAYERS)
      .add({
        email,
        name,
        groupName: group.name,
        groupId,
        joinDate: new Date()
      })
      .then(player => {
        return firebase
          .firestore()
          .collection(GROUPS)
          .doc(groupId)
          .update({
            players: firebase.firestore.FieldValue.arrayUnion({
              email,
              name,
              userId: player.id,
              joinDate: new Date()
            })
          });
      })
      .then(() => {
        dispatch(apiEnd());
      });
  };
}

// thunks
export function loadPlayers() {
  return (dispatch, getState) => {
    const curr = getState();
    if (Object.keys(curr.players).length > 0) {
      return Promise.resolve();
    }

    dispatch(apiStart(PlayerActionTypes.LOAD_PLAYERS));
    return firebase
      .firestore()
      .collection(USERS)
      .get()
      .then(users => {
        const allUsers = {};
        users.forEach(doc => {
          allUsers[doc.id] = {
            id: doc.id,
            ...doc.data()
          };
        });
        dispatch(apiEnd());
        dispatch({
          type: PlayerActionTypes.LOAD_PLAYERS_SUCCESS,
          players: allUsers
        } as LoadPlayersSuccessAction);
      });
  };
}

export function getStatsByPlayer({ groupId, tourId, playerId }) {
  return firebase
    .firestore()
    .collection(GROUPS)
    .doc(groupId)
    .collection(TOURNAMENTS)
    .doc(tourId)
    .collection(STATS)
    .where("playerId", "==", playerId)
    .get()
    .then(x => x.docs.map(y => ({ ...y.data(), id: y.id })));
}

export function getMatchesByPlayer({ groupId, tourId, playerId }) {
  const scoreRef = firebase
    .firestore()
    .collection(GROUPS)
    .doc(groupId)
    .collection(TOURNAMENTS)
    .doc(tourId)
    .collection(SCORES);
  const win = scoreRef.where(`winners.${playerId}`, "==", true).get();

  const lost = scoreRef.where(`losers.${playerId}`, "==", true).get();

  return Promise.all([win, lost]).then(results => {
    const r = [
      ...results[0].docs.map(y => y.data()),
      ...results[1].docs.map(y => y.data())
    ];
    return pipe(
      sortBy(x => (x.timestamp || x.matchDate).toDate()),
      reverse
    )(r);
  });
}

export type PlayerAction =
  | LoadPlayersSuccessAction
  | AddPlayerAction
  | RemovePlayerAction;
