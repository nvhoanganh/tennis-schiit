import { AppActionTypes, AppAction } from "../actions";
import { IPlayer } from "../models";

export interface IPlayersState {
  [playerId: string]: IPlayer;
}

const players = (
  state: IPlayersState = {},
  action: AppAction
): IPlayersState => {
  switch (action.type) {
    case AppActionTypes.REMOVE_PLAYER:
      const { [action.playerId]: deleted, ...newState } = state;
      return newState;
    case AppActionTypes.LOAD_PLAYER_SUCCESS:
      return action.players;
    case AppActionTypes.ADD_PLAYER:
      return {
        ...state,
        [action.player.playerId]: action.player
      };
    default:
      return state;
  }
};

export default players;
