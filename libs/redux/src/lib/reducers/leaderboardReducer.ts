/* eslint-disable @typescript-eslint/no-explicit-any */
import { LeaderboardAction, LeaderboardActionTypes } from "../actions";

interface LeaderboardState {
  groupId?: any;
  user?: any;
  tournament?: any;
  results?: any;
  loading?: boolean;
  players?: any;
}

const getAllPlayers = action => {
  return action.tournament && action.tournament.players
    ? action.tournament.players
    : Object.values(action.group.players);
};

const leaderboard = (
  state: LeaderboardState = {},
  action: LeaderboardAction
): LeaderboardState => {
  switch (action.type) {
    case LeaderboardActionTypes.GET_USER_SUCCESS:
      return {
        ...state,
        user: action.user
      };

    case LeaderboardActionTypes.LOAD_LEADERBOARD:
      return {
        ...state,
        loading: true,
        groupId: action.groupId,
        tournament: null,
        players: null
      };
    case LeaderboardActionTypes.LOAD_LEADERBOARD_FAILED:
      return {
        ...state,
        loading: false
      };

    case LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS:
      return {
        ...state,
        groupId: action.groupId,
        loading: false,
        tournament: action.tournament,
        players: getAllPlayers(action)
      };
    default:
      return state;
  }
};

export default leaderboard;
