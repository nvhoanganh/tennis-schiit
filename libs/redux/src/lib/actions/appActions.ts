import { IAction, delay } from "../utils";
export enum AppActionTypes {
  API_ERROR = "LAST_API_ERROR",
  API_START = "API_START",
  API_END = "API_END"
}

export class ApiStartAction implements IAction {
  readonly type = AppActionTypes.API_START;
  constructor(public action: string) {}
}
export class ApiEndAction implements IAction {
  readonly type = AppActionTypes.API_END;
}
export class ApiErrorAction implements IAction {
  readonly type = AppActionTypes.API_ERROR;
  constructor(public action: string, public err: any) {}
}

export function apiStart(action: string): ApiStartAction {
  return { type: AppActionTypes.API_START, action };
}
export function apiEnd(): ApiEndAction {
  return { type: AppActionTypes.API_END };
}
export function apiError(action: string, err: any): ApiErrorAction {
  return { type: AppActionTypes.API_ERROR, action, err };
}
export type AppAction = ApiStartAction | ApiEndAction | ApiErrorAction;
