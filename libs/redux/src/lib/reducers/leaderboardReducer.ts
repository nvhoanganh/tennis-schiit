import { LeaderboardAction, LeaderboardActionTypes } from "../actions";

interface ILeaderboardState {
  groupId?: any;
  tournament?: any;
  loading?: boolean;
  players?: any;
}

const leaderboard = (
  state: ILeaderboardState = {},
  action: LeaderboardAction
): ILeaderboardState => {
  switch (action.type) {
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
      const getAllPlayers = () => {
        return action.tournament && action.tournament.players
          ? action.tournament.players
          : Object.values(action.group.players);
      };
      return {
        ...state,
        groupId: action.groupId,
        loading: false,
        tournament: action.tournament,
        players: getAllPlayers()
      };
    default:
      return state;
  }
};

export default leaderboard;
