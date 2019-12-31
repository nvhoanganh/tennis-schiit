import { PlayerActionTypes } from "../actions";
import { IPlayer } from "../models";
import { PlayerAction } from "../actions";

export interface IPlayersState {
  [playerId: string]: IPlayer;
}

const players = (
  state: IPlayersState = {},
  action: PlayerAction
): IPlayersState => {
  switch (action.type) {
    case PlayerActionTypes.REMOVE_PLAYER:
      const { [action.playerId]: deleted, ...newEntities } = state;
      return newEntities;
    case PlayerActionTypes.LOAD_PLAYERS_SUCCESS:
      return action.players;
    
    case PlayerActionTypes.ADD_PLAYER:
      return {
        ...state,
        [action.player.playerId]: action.player
      };
    default:
      return state;
  }
};

export default players;
