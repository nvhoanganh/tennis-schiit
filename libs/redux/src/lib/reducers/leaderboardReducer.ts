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
    case LeaderboardActionTypes.LOAD_LEADERBOARD_SUCCESS:
      return {
        ...state,
        groupId: action.groupId,
        tournament: {
          startDate: action.tournament.startDate,
          endDate: action.tournament.endDate
        },
        players: action.tournament.players
      };
    default:
      return state;
  }
};

export default leaderboard;
