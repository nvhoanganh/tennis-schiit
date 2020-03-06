import { approveJoinRequest, cancelJoinGroup, getActivePlayersForGroup, getAppLoaded, getCurrentUser, getCurrLeaderGroup, getCurrLeaderTournament, getIsPendingJoin, getPendingJoinRequest, getPendingRequests, getPwaHandle, getUserTurnedOnPushNotification, joinGroup, leaveGroup, loadLeaderboard, loadPlayers, loadResults, rejectJoinRequest } from "@tennis-score/redux";
import { connect } from "react-redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = state => ({
  players: getActivePlayersForGroup(state),
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
  leaveGroup: groupId => dispatch(leaveGroup(groupId)),
  rejectJoinRequest: (user, groupId) =>
    dispatch(rejectJoinRequest(user, groupId)),
  approveJoinRequest: (user, group, createAs) =>
    dispatch(approveJoinRequest(user, group, createAs)),
  cancelJoinGroup: groupId => dispatch(cancelJoinGroup(groupId)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId)),
  loadResult: (groupId, tourid, more) =>
    dispatch(loadResults(groupId, tourid, more))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
