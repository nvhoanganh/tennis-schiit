import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { GROUPS, IGroup, TOURNAMENTS, SCORES } from "../models";
import { arrayToObject } from "../utils";
import { apiEnd, apiStart } from "./appActions";
import { IAction } from "@tennis-score/redux";
export enum LeaderboardActionTypes {
  LOAD_LEADERBOARD = "LOAD_LEADERBOARD",
  LOAD_LEADERBOARD_SUCCESS = "LOAD_LEADERBOARD_SUCCESS",
  SUBMIT_SCORE = "SUBMIT_SCORE",
  SUBMIT_SCORE_SUCCESS = "SUBMIT_SCORE_SUCCESS"
}

// actions
export class LoadLeaderboardSuccessAction implements IAction {
  readonly type = LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS;
  constructor(
    public group: any,
    public groupId: string,
    public tournament: any
  ) {}
}

export class LoadLeaderboardAction implements IAction {
  readonly type = LeaderboardActionTypes.LOAD_LEADERBOARD;
  constructor(public groupId: any) {}
}

export class SubmitScoreSuccessAction implements IAction {
  readonly type = LeaderboardActionTypes.SUBMIT_SCORE_SUCCESS;
  constructor(public newScoreId: string) {}
}

// action creators

// thunks
export function loadLeaderboard(groupId: string) {
  return async dispatch => {
    dispatch(<LoadLeaderboardAction>{
      type: LeaderboardActionTypes.LOAD_LEADERBOARD,
      groupId: groupId
    });
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
    if (fgroupData.currentTournament) {
      const currentTournament = await firebase
        .firestore()
        .collection(GROUPS)
        .doc(groupId)
        .collection(TOURNAMENTS)
        .doc(fgroupData.currentTournament)
        .get();

      dispatch(<LoadLeaderboardSuccessAction>{
        type: LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS,
        group: fgroupData,
        groupId,
        tournament: currentTournament.exists ? currentTournament.data() : null
      });
    } else {
      dispatch(<LoadLeaderboardSuccessAction>{
        type: LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS,
        group: fgroupData,
        groupId,
        tournament: null
      });
    }

    return Promise.resolve();
  };
}

export function submitScore({
  groupId,
  group,
  currentTournament,
  winners,
  losers,
  gameWonByLostTeam,
  reverseBagel,
  matchDate,
  ...score
}) {
  return async (dispatch, getState) => {
    dispatch(apiStart(LeaderboardActionTypes.SUBMIT_SCORE));
    const groupRef = firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId);

    const tourRef = groupRef.collection(TOURNAMENTS).doc(currentTournament);

    const g = await tourRef.collection(SCORES).add({
      winners,
      losers,
      gameWonByLostTeam,
      reverseBagel,
      matchDate: new Date(matchDate)
    });

    // update other -> this should be in firebase func
    const batch = firebase.firestore().batch();
    batch.update(groupRef, {
      played: firebase.firestore.FieldValue.increment(1)
    });
    batch.update(groupRef, {
      lastMatch: new Date()
    });

    const winnersK = Object.keys(winners);
    const loserK = Object.keys(losers);
    const winByBagel = gameWonByLostTeam === 0 || reverseBagel;
    winnersK.forEach(k => {
      batch.update(tourRef, {
        [`players.${k}.won`]: firebase.firestore.FieldValue.increment(1)
      });
    });
    loserK.forEach(k => {
      batch.update(tourRef, {
        [`players.${k}.lost`]: firebase.firestore.FieldValue.increment(1)
      });
    });

    if (winByBagel) {
      winnersK.forEach(k => {
        batch.update(tourRef, {
          [`players.${k}.bagelWon`]: firebase.firestore.FieldValue.increment(1)
        });
      });
      loserK.forEach(k => {
        batch.update(tourRef, {
          [`players.${k}.bagelLost`]: firebase.firestore.FieldValue.increment(1)
        });
      });
    }
    await batch.commit();

    dispatch(apiEnd());
    dispatch(<SubmitScoreSuccessAction>{
      type: LeaderboardActionTypes.SUBMIT_SCORE_SUCCESS,
      newScoreId: g.id
    });

    return Promise.resolve(g.id);
  };
}

export type LeaderboardAction =
  | LoadLeaderboardSuccessAction
  | LoadLeaderboardAction;
