import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { GROUPS, IGroup, TOURNAMENTS } from "../models";
import { arrayToObject, IAction } from "../utils";
import { apiEnd, apiStart } from "./appActions";
export enum LeaderboardActionTypes {
  LOAD_LEADERBOARD = "LOAD_LEADERBOARD",
  LOAD_LEADERBOARD_SUCCESS = "LOAD_LEADERBOARD_SUCCESS"
}

// actions
export class LoadLeaderboardAction implements IAction {
  readonly type = LeaderboardActionTypes.LOAD_LEADERBOARD;
  constructor(public groupId: string) {}
}
export class LoadLeaderboardSuccessAction implements IAction {
  readonly type = LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS;
  constructor(public groupId: any, public players: any) {}
}

// action creators

// thunks
export function loadLeaderboard(groupId: string) {
  return async dispatch => {
    dispatch(apiStart(LeaderboardActionTypes.LOAD_LEADERBOARD));
    const group = await firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .get();

    dispatch(apiEnd());
    if (!group.exists) {
      return Promise.resolve();
    }

    const fgroupData = group.data();
    // get current leader board
    const currentTournament = await firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId)
      .collection(TOURNAMENTS)
      .doc(fgroupData.currentTournament)
      .get();

    dispatch(<LoadLeaderboardSuccessAction>{
      type: LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS,
      groupId: groupId,
      players: currentTournament.exists ? currentTournament.data() : null
    });
    return Promise.resolve();
  };
}

export type LeaderboardAction =
  | LoadLeaderboardAction
  | LoadLeaderboardSuccessAction;
