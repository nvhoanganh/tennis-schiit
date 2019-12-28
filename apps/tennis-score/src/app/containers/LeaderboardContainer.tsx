import {
  getAppLoaded,
  getCurrLeaderGroup,
  getCurrLeaderTournament,
  getLeaderboardPlayers,
  getPendingRequests,
  loadGroups,
  loadLeaderboard,
  loadPlayers,
  getUser,
  getLoadingLeaderboard,
  joinGroup,
  getIsPendingJoin,
  cancelJoinGroup,
  getPendingJoinRequest
} from "@tennis-score/redux";
import { connect } from "react-redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = state => ({
  players: getLeaderboardPlayers(state),
  user: getUser(state),
  group: getCurrLeaderGroup(state),
  pendingRequests: getPendingRequests(state),
  appLoaded: getAppLoaded(state),
  tournament: getCurrLeaderTournament(state),
  loading: getLoadingLeaderboard(state),
  pendingJoinRequests: getPendingJoinRequest(state),
  isPendingJoin: getIsPendingJoin(state)
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadGroups: _ => dispatch(loadGroups()),
  joinGroup: groupId => dispatch(joinGroup(groupId)),
  cancelJoinGroup: groupId => dispatch(cancelJoinGroup(groupId)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
