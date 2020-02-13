import { IScore, GROUPS, TOURNAMENTS, SCORES } from "../models";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import * as R from "ramda";
import { delay, arrayToObject } from "../utils";
import { apiStart, apiEnd } from "./appActions";
import { IAction } from "@tennis-score/redux";
export enum ScoreActionTypes {
  LOAD_RESULTS = "LOAD_RESULTS",
  LOAD_RESULTS_FAILED = "LOAD_RESULTS_FAILED",
  LOAD_RESULTS_SUCCESS = "LOAD_RESULTS_SUCCESS",

  ADD_SCORE = "ADD_SCORE",
  DELETE_SCORE = "DELETE_SCORE",
  UPDATE_SCORE = "UPDATE_SCORE"
}

// actions
export class AddScoreAction implements IAction {
  readonly type = ScoreActionTypes.ADD_SCORE;
  constructor(public score: IScore) {}
}
export class DeleteScoreAction implements IAction {
  readonly type = ScoreActionTypes.DELETE_SCORE;
  constructor(public id: string) {}
}
export class UpdateScoreAction implements IAction {
  readonly type = ScoreActionTypes.UPDATE_SCORE;
  constructor(public score: IScore) {}
}

export class LoadResultsSuccessAction implements IAction {
  readonly type = ScoreActionTypes.LOAD_RESULTS_SUCCESS;
  constructor(public results: any) {}
}

export class LoadResultsAction implements IAction {
  readonly type = ScoreActionTypes.LOAD_RESULTS;
  constructor(public groupId: string) {}
}

export class LoadResultsFailedAction implements IAction {
  readonly type = ScoreActionTypes.LOAD_RESULTS_FAILED;
  constructor(public error: any) {}
}

// action creators
export function addScore(score: IScore): AddScoreAction {
  return { type: ScoreActionTypes.ADD_SCORE, score };
}

export function deleteScore(id: string): DeleteScoreAction {
  return { type: ScoreActionTypes.DELETE_SCORE, id };
}

export function updateScore(score: IScore): UpdateScoreAction {
  return { type: ScoreActionTypes.UPDATE_SCORE, score };
}

// thunks
export function loadResults(groupId, tourId, after) {
  return (dispatch, getState) => {
    dispatch(
      apiStart(ScoreActionTypes.LOAD_RESULTS, { groupId, tourId, after })
    );
    const groupRef = firebase
      .firestore()
      .collection(GROUPS)
      .doc(groupId);

    const tourRef = groupRef.collection(TOURNAMENTS).doc(tourId);
    const queryRef = !after
      ? tourRef
          .collection(SCORES)
          .orderBy("matchDate", "desc")
          .limit(10)
      : tourRef
          .collection(SCORES)
          .orderBy("matchDate", "desc")
          .startAfter(after)
          .limit(10);

    return queryRef.get().then(querySnapshot => {
      const data = arrayToObject(
        querySnapshot.docs,
        x => x.id,
        x => ({ ...x.data(), scoreId: x.id })
      );

      dispatch(apiEnd());
      dispatch({
        type: ScoreActionTypes.LOAD_RESULTS_SUCCESS,
        results: {
          data,
          after,
          lastDoc: R.last(querySnapshot.docs),
          hasMore: !querySnapshot.empty
        }
      } as LoadResultsSuccessAction);
    });
  };
}

export type ScoreAction =
  | LoadResultsAction
  | LoadResultsSuccessAction
  | LoadResultsFailedAction
  | AddScoreAction
  | UpdateScoreAction
  | DeleteScoreAction;
