import {
  getAppLoaded,
  getCurrLeaderGroup,
  getLeaderboardPlayers,
  getLoadingLeaderboard,
  getPendingRequests,
  getCurrentUser,
  signOut,
  loadGroups,
  loadLeaderboard,
  getCurrLeaderTournament,
  getUser,
  getLeaderBoardGroupUser
} from "@tennis-score/redux";
import { connect } from "react-redux";
import PlayerProfile from "../components/PlayerProfile";

const mapStateToProps = (state, ownProps) => {
  return {
    user: getCurrentUser(state),
    player: getLeaderBoardGroupUser(state),
    group: getCurrLeaderGroup(state),
    tournament: getCurrLeaderTournament(state),
    pendingRequests: getPendingRequests(state),
    appLoaded: getAppLoaded(state),
    loading: getLoadingLeaderboard(state)
  };
};

const mapDispatchToProps = dispatch => ({
  loadGroups: _ => dispatch(loadGroups()),
  getUser: u => dispatch(getUser(u)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerProfile);
