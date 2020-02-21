import { setNewScore } from "@tennis-score/api-interfaces";
import { IAction } from "@tennis-score/redux";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { merge } from "ramda";
import { GROUPS, SCORES, STATS, TOURNAMENTS, USERS } from "../models";
import { arrayToObject, calculateStats, getPlayers } from "../utils";
import { apiEnd, apiStart, AppActionTypes } from "./appActions";

export enum LeaderboardActionTypes {
  GET_USER = "GET_USER",
  GET_USER_SUCCESS = "GET_USER_SUCCESS",

  LOAD_LEADERBOARD = "LOAD_LEADERBOARD",
  LOAD_LEADERBOARD_SUCCESS = "LOAD_LEADERBOARD_SUCCESS",
  LOAD_LEADERBOARD_FAILED = "LOAD_LEADERBOARD_FAILED",

  SUBMIT_SCORE = "SUBMIT_SCORE",
  SUBMIT_SCORE_SUCCESS = "SUBMIT_SCORE_SUCCESS"
}

// actions
export class GetUserAction implements IAction {
  readonly type = LeaderboardActionTypes.GET_USER;
  constructor(public user: any) {}
}

export class GetUserSuccessAction implements IAction {
  readonly type = LeaderboardActionTypes.GET_USER_SUCCESS;
  constructor(public user: any) {}
}
export class LoadLeaderboardSuccessAction implements IAction {
  readonly type = LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS;
  constructor(
    public group: any,
    public groupId: string,
    public tournament: any,
    public groupListener: any
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
export function getGroupPlayerSuccess(user): GetUserSuccessAction {
  return { type: LeaderboardActionTypes.GET_USER_SUCCESS, user };
}

// thunks
export function getPlayer(playerId, userId) {
  return dispatch => {
    dispatch(apiStart(LeaderboardActionTypes.GET_USER));
    return firebase
      .firestore()
      .collection(USERS)
      .doc(userId)
      .get()
      .then(user => {
        dispatch(apiEnd());
        dispatch({
          type: LeaderboardActionTypes.GET_USER_SUCCESS,
          user: { ...user.data(), playerId, userId }
        });
      })
      .catch(err => dispatch({ type: AppActionTypes.API_ERROR, err }));
  };
}

export function loadLeaderboard(groupId: string) {
  return async (dispatch, getState) => {
    const {
      leaderboard: { groupId: currentGroupId, groupListener, tournament }
    } = getState();

    if (groupId === currentGroupId && tournament) {
      return;
    }

    if (typeof groupListener === "function") {
      groupListener();
    }

    dispatch({
      type: LeaderboardActionTypes.LOAD_LEADERBOARD,
      groupId: groupId
    } as LoadLeaderboardAction);

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
    if (fgroupData.currentTournament) {
      const unsubscribe = firebase
        .firestore()
        .collection(GROUPS)
        .doc(groupId)
        .collection(TOURNAMENTS)
        .doc(fgroupData.currentTournament)
        .onSnapshot(currentTournament => {
          dispatch({
            type: LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS,
            group: fgroupData,
            groupId,
            tournament: currentTournament.exists
              ? currentTournament.data()
              : null,
            groupListener: unsubscribe
          } as LoadLeaderboardSuccessAction);
        });
    } else {
      dispatch({
        type: LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS,
        group: fgroupData,
        groupId,
        tournament: null
      } as LoadLeaderboardSuccessAction);
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
  headStart
}) {
  return async (dispatch, getState) => {
    const {
      leaderboard: {
        players,
        tournament: { prize }
      }
    } = getState();
    dispatch(apiStart(LeaderboardActionTypes.SUBMIT_SCORE));

    /// calculate score based on previous
    const mWinners = {};
    const mLosers = {};
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
      headStart,
      gameWonByLostTeam,
      reverseBagel,
      matchDate: new Date(matchDate),
      timestamp: new Date()
    });

    // update other -> this should be in firebase func
    const batch = firebase.firestore().batch();
    batch.update(groupRef, {
      played: firebase.firestore.FieldValue.increment(1),
      lastMatch: new Date()
    });

    const winnersK = Object.keys(mWinners);
    const loserK = Object.keys(mLosers);
    const winByBagel = gameWonByLostTeam === "0" || reverseBagel;
    winnersK.forEach(k => {
      // update each
      if (winByBagel) {
        mWinners[k].bagelWon = (mWinners[k].bagelWon || 0) + 1;
      }
      mWinners[k].won = (mWinners[k].won || 0) + 1;

      mWinners[k] = {
        ...mWinners[k],
        ...calculateStats(mWinners[k], prize),
        playerId: k,
        timestamp: new Date(matchDate),
        lastMatch: new Date()
      };
      batch.update(tourRef, {
        [`players.${k}.won`]: firebase.firestore.FieldValue.increment(1),
        [`players.${k}.previousScore`]: mWinners[k].previousScore,
        [`players.${k}.score`]: mWinners[k].score,
        [`players.${k}.skill`]: mWinners[k].skill,
        [`players.${k}.lastMatch`]: new Date()
      });
      // add hisoric data
      const newHistoricRef = tourRef.collection(STATS).doc();
      batch.set(newHistoricRef, mWinners[k]);
    });

    loserK.forEach(k => {
      if (winByBagel) {
        mLosers[k].bagelLost = (mLosers[k].bagelLost || 0) + 1;
      }
      mLosers[k].lost = (mLosers[k].lost || 0) + 1;

      mLosers[k] = {
        ...mLosers[k],
        ...calculateStats(mLosers[k], prize),
        playerId: k,
        timestamp: new Date(matchDate),
        lastMatch: new Date()
      };
      batch.update(tourRef, {
        [`players.${k}.lost`]: firebase.firestore.FieldValue.increment(1),
        [`players.${k}.previousScore`]: mLosers[k].previousScore,
        [`players.${k}.score`]: mLosers[k].score,
        [`players.${k}.skill`]: mLosers[k].skill,
        [`players.${k}.lastMatch`]: new Date()
      });
      // add hisoric data
      const newHistoricRef = tourRef.collection(STATS).doc();
      batch.set(newHistoricRef, mLosers[k]);
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
    dispatch({
      type: LeaderboardActionTypes.SUBMIT_SCORE_SUCCESS,
      newScoreId: g.id
    } as SubmitScoreSuccessAction);
    return Promise.resolve(g.id);
  };
}

export async function SearchScore({ groupId, tourId, winners, losers }) {
  const groupRef = firebase
    .firestore()
    .collection(GROUPS)
    .doc(groupId);

  const tourRef = groupRef.collection(TOURNAMENTS).doc(tourId);
  const winnersG = getPlayers(winners);
  const loserG = getPlayers(losers);
  const scoresRef = tourRef.collection(SCORES);
  const left = winnersG.player2 /// 2 players
    ? scoresRef
        .where("winners", "==", winners)
        .where("losers", "==", losers)
        .get()
    : scoresRef
        .where(`winners.${winnersG.player1}`, "==", true)
        .where(`losers.${loserG.player1}`, "==", true)
        .get();

  const right = loserG.player2 /// 2 players
    ? scoresRef
        .where("winners", "==", losers)
        .where("losers", "==", winners)
        .get()
    : scoresRef
        .where(`winners.${loserG.player1}`, "==", true)
        .where(`losers.${winnersG.player1}`, "==", true)
        .get();

  return Promise.all([left, right]).then(results => {
    const d = results.map(r =>
      arrayToObject(r.docs, x => x.id, x => ({ ...x.data(), id: x.id }))
    );
    const merged = merge(d[0], d[1]);
    return merged;
  });
}

export async function DeleteScore({
  scoreId,
  groupId,
  tourId,
  winners,
  losers
}) {
  const groupRef = firebase
    .firestore()
    .collection(GROUPS)
    .doc(groupId);

  const tourRef = groupRef.collection(TOURNAMENTS).doc(tourId);
  const statsRef = tourRef.collection(STATS);
  const players = { ...winners, ...losers };
  const lastStats = await Promise.all(
    Object.keys(players).map(playerId =>
      statsRef
        .where("playerId", "==", playerId)
        .orderBy("played", "desc")
        .limit(2)
        .get()
        .then(x => {
          return x.docs.map(y => ({ ...y.data(), id: y.id }));
        })
    )
  );
  const batch = firebase.firestore().batch();
  lastStats.forEach(x => {
    if (x.length === 0) {
      return;
    }
    // delete last match
    batch.delete(statsRef.doc(x[0].id));
    const k = x[0]["playerId"];
    if (x.length > 1) {
      const preMatch = x[1] as any;
      // update player stats back to previous stats
      batch.update(tourRef, {
        [`players.${k}.won`]: preMatch.won || 0,
        [`players.${k}.lost`]: preMatch.lost || 0,
        [`players.${k}.previousScore`]: preMatch.previousScore,
        [`players.${k}.score`]: preMatch.score,
        [`players.${k}.skill`]: preMatch.skill,
        [`players.${k}.lastMatch`]: preMatch.lastMatch.toDate(),
        [`players.${k}.bagelWon`]: preMatch.bagelWon || 0,
        [`players.${k}.bagelLost`]: preMatch.bagelLost || 0
      });
    } else {
      // delete player from tournament
      batch.update(tourRef, {
        [`players.${k}`]: firebase.firestore.FieldValue.delete()
      });
    }
  });

  // delete score
  batch.delete(tourRef.collection(SCORES).doc(scoreId));
  // set played count for the group
  batch.update(groupRef, {
    played: firebase.firestore.FieldValue.increment(-1)
  });
  await batch.commit();
  return Promise.resolve();
}
export type LeaderboardAction =
  | GetUserSuccessAction
  | LoadLeaderboardSuccessAction
  | LoadLeaderboardFailedAction
  | LoadLeaderboardAction;
