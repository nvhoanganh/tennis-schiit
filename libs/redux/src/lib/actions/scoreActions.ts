import { IScore } from "../models";
import { IAction, delay } from "../utils";
import { apiStart, apiEnd } from "./appActions";
export enum ScoreActionTypes {
  LOAD_SCORE = "LOAD_SCORE_SUCCESS",
  LOAD_SCORE_FAILED = "LOAD_SCORE_FAILED",
  LOAD_SCORE_SUCCESS = "LOAD_SCORE_SUCCESS",

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

export class LoadScoresSuccessAction implements IAction {
  readonly type = ScoreActionTypes.LOAD_SCORE_SUCCESS;
  constructor(
    public scores: {
      total: number;
      scores: {
        [scoreId: string]: IScore;
      };
      offset: number;
    }
  ) {}
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
export function loadScores() {
  return dispatch => {
    dispatch(apiStart(ScoreActionTypes.LOAD_SCORE));
    return delay(2000).then(_ => {
      dispatch(apiEnd());
      dispatch(<LoadScoresSuccessAction>{
        type: ScoreActionTypes.LOAD_SCORE_SUCCESS
      });
    });
  };
}

export type ScoreAction =
  | AddScoreAction
  | UpdateScoreAction
  | DeleteScoreAction
  | LoadScoresSuccessAction;
