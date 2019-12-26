import { LeaderboardAction, LeaderboardActionTypes } from "../actions";

interface ILeaderboardState {
  groupId?: any;
  tournament?: any;
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
        groupId: action.groupId,
        tournament: null,
        players: null
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
        tournament: action.tournament
          ? {
              startDate: action.tournament.startDate,
              endDate: action.tournament.endDate
            }
          : null,
        players: getAllPlayers()
      };
    default:
      return state;
  }
};

export default leaderboard;
