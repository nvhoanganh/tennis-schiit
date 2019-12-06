import { AppActionTypes, AppAction } from "../actions";
import { IGroup, IPlayer } from "../models";

export interface IAppState {
  pendingRequests: number;
  user?: IPlayer;
}

const app = (
  state: IAppState = { pendingRequests: 0 },
  action: AppAction
): IAppState => {
  switch (action.type) {
    case AppActionTypes.API_START:
      return {
        ...state,
        pendingRequests: state.pendingRequests + 1
      };
    case AppActionTypes.API_END:
      return {
        ...state,
        pendingRequests: state.pendingRequests - 1
      };

    default:
      return state;
  }
};

export default app;
