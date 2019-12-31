import {
  approveJoinRequest,
  cancelJoinGroup,
  getAppLoaded,
  getCurrLeaderGroup,
  getCurrLeaderTournament,
  getIsPendingJoin,
  getLeaderboardPlayers,
  getLoadingLeaderboard,
  getPendingJoinRequest,
  getPendingRequests,
  getScores,
  getCurrentUser,
  joinGroup,
  loadGroups,
  loadLeaderboard,
  loadPlayers,
  loadResults,
  rejectJoinRequest,
  getLeaderboardPlayersObj
} from "@tennis-score/redux";
import { connect } from "react-redux";
import ViewResults from "../components/ViewResults";

const mapStateToProps = state => ({
  players: getLeaderboardPlayersObj(state),
  user: getCurrentUser(state),
  group: getCurrLeaderGroup(state),
  pendingRequests: getPendingRequests(state),
  appLoaded: getAppLoaded(state),
  tournament: getCurrLeaderTournament(state),
  loading: getLoadingLeaderboard(state),
  pendingJoinRequests: getPendingJoinRequest(state),
  scores: getScores(state),
  isPendingJoin: getIsPendingJoin(state)
});

const mapDispatchToProps = dispatch => ({
  loadResult: (groupId, tourid) => dispatch(loadResults(groupId, tourid)),
  loadGroups: _ => dispatch(loadGroups()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewResults);
