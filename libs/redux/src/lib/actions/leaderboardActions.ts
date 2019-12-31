import * as firebase from "firebase/app";
import "firebase/auth";
import { setNewScore } from "@tennis-score/api-interfaces";
import "firebase/firestore";
import { GROUPS, IGroup, TOURNAMENTS, SCORES } from "../models";
import { arrayToObject } from "../utils";
import { apiEnd, apiStart } from "./appActions";
import { IAction } from "@tennis-score/redux";
export enum LeaderboardActionTypes {

  LOAD_LEADERBOARD = "LOAD_LEADERBOARD",
  LOAD_LEADERBOARD_SUCCESS = "LOAD_LEADERBOARD_SUCCESS",
  LOAD_LEADERBOARD_FAILED = "LOAD_LEADERBOARD_FAILED",

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

export class LoadLeaderboardFailedAction implements IAction {
  readonly type = LeaderboardActionTypes.LOAD_LEADERBOARD_FAILED;
  constructor(public erro: any) {}
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
      dispatch({
        type: LeaderboardActionTypes.LOAD_LEADERBOARD_FAILED,
        error: "group not found"
      });
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
  group,
  winners,
  losers,
  gameWonByLostTeam,
  reverseBagel,
  matchDate,
  ...score
}) {
  return async (dispatch, getState) => {
    const {
      leaderboard: { players }
    } = getState();
    dispatch(apiStart(LeaderboardActionTypes.SUBMIT_SCORE));

    /// calculate score based on previous
    let mWinners = {};
    let mLosers = {};
    Object.keys(winners).forEach(key => {
      mWinners[key] = players[key] || {};
    });
    Object.keys(losers).forEach(key => {
      mLosers[key] = players[key] || {};
    });
    // update
    setNewScore(mWinners, mLosers);

    const groupRef = firebase
      .firestore()
      .collection(GROUPS)
      .doc(group.groupId);

    const tourRef = groupRef
      .collection(TOURNAMENTS)
      .doc(group.currentTournament);

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

    const winnersK = Object.keys(mWinners);
    const loserK = Object.keys(mLosers);
    const winByBagel = gameWonByLostTeam === "0" || reverseBagel;
    winnersK.forEach(k => {
      batch.update(tourRef, {
        [`players.${k}.won`]: firebase.firestore.FieldValue.increment(1),
        [`players.${k}.previousScore`]: mWinners[k].previousScore,
        [`players.${k}.score`]: mWinners[k].score,
        [`players.${k}.skill`]: mWinners[k].skill,
        [`players.${k}.lastMatch`]: new Date()
      });
    });

    loserK.forEach(k => {
      batch.update(tourRef, {
        [`players.${k}.lost`]: firebase.firestore.FieldValue.increment(1),
        [`players.${k}.previousScore`]: mLosers[k].previousScore,
        [`players.${k}.score`]: mLosers[k].score,
        [`players.${k}.skill`]: mLosers[k].skill,
        [`players.${k}.lastMatch`]: new Date()
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
    // end

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
  | LoadLeaderboardFailedAction
  | LoadLeaderboardAction;
