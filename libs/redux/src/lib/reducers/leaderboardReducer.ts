import { LeaderboardAction, LeaderboardActionTypes } from "../actions";

interface ILeaderboardState {
  groupId?: any;
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
        players: action.players
      };
    default:
      return state;
  }
};

export default leaderboard;
