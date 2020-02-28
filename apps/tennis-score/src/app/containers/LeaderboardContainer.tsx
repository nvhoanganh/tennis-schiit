import {
  approveJoinRequest,
  cancelJoinGroup,
  getAppLoaded,
  getCurrentUser,
  getCurrLeaderGroup,
  getCurrLeaderTournament,
  getIsPendingJoin,
  getLeaderboardPlayers,
  getPendingJoinRequest,
  getPendingRequests,
  getPwaHandle,
  joinGroup,
  loadLeaderboard,
  loadPlayers,
  loadResults,
  rejectJoinRequest,
  getUserTurnedOnPushNotification
} from "@tennis-score/redux";
import { connect } from "react-redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = state => ({
  players: getLeaderboardPlayers(state),
  user: getCurrentUser(state),
  pushNotificationIsOn: getUserTurnedOnPushNotification(state),
  pwaHandle: getPwaHandle(state),
  group: getCurrLeaderGroup(state),
  pendingRequests: getPendingRequests(state),
  appLoaded: getAppLoaded(state),
  tournament: getCurrLeaderTournament(state),
  loading: getPendingRequests(state),
  pendingJoinRequests: getPendingJoinRequest(state),
  isPendingJoin: getIsPendingJoin(state)
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  joinGroup: groupId => dispatch(joinGroup(groupId)),
  rejectJoinRequest: (user, groupId) =>
    dispatch(rejectJoinRequest(user, groupId)),
  approveJoinRequest: (user, groupId, createAs) =>
    dispatch(approveJoinRequest(user, groupId, createAs)),
  cancelJoinGroup: groupId => dispatch(cancelJoinGroup(groupId)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId)),
  loadResult: (groupId, tourid, more) =>
    dispatch(loadResults(groupId, tourid, more))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
