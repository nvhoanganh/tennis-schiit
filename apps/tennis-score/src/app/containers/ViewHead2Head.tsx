import { getAppLoaded, getCurrentUser, getCurrLeaderGroup, getCurrLeaderTournament, getLeaderboardPlayers, getLeaderboardPlayersObj, getPendingRequests, loadGroups, loadLeaderboard, loadPlayers, submitScore } from "@tennis-score/redux";
import { connect } from "react-redux";
import ViewHead2Head from "../components/ViewHead2Head";

const mapStateToProps = state => ({
  players: getLeaderboardPlayers(state),
  playersAsObject: getLeaderboardPlayersObj(state),
  user: getCurrentUser(state),
  group: getCurrLeaderGroup(state),
  pendingRequests: getPendingRequests(state),
  appLoaded: getAppLoaded(state),
  tournament: getCurrLeaderTournament(state)
});
const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadGroups: _ => dispatch(loadGroups()),
  submitScore: s => dispatch(submitScore(s)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewHead2Head);
