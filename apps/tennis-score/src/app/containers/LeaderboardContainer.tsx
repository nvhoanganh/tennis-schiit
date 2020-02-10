import {
  getAppLoaded,
  getCurrLeaderGroup,
  getCurrLeaderTournament,
  getLeaderboardPlayers,
  getPendingRequests,
  loadGroups,
  loadLeaderboard,
  loadPlayers,
  getCurrentUser,
  getLoadingLeaderboard,
  joinGroup,
  getIsPendingJoin,
  cancelJoinGroup,
  getPendingJoinRequest,
  rejectJoinRequest,
  approveJoinRequest,
  loadResults,
  getScores,
  getLastDoc,
  getHasMore,
  getStats,
  getPwaHandle,
  getWebPushSubAction
} from "@tennis-score/redux";
import { connect } from "react-redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = state => ({
  players: getLeaderboardPlayers(state),
  user: getCurrentUser(state),
  pwaHandle: getPwaHandle(state),
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
  rejectJoinRequest: (user, groupId) =>
    dispatch(rejectJoinRequest(user, groupId)),
  approveJoinRequest: (user, groupId, createAs) =>
    dispatch(approveJoinRequest(user, groupId, createAs)),
  cancelJoinGroup: groupId => dispatch(cancelJoinGroup(groupId)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId)),
  getNotificationSub: _ => dispatch(getWebPushSubAction()),
  loadResult: (groupId, tourid, more) =>
    dispatch(loadResults(groupId, tourid, more))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
