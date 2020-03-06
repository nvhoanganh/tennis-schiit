import { getAppLoaded, getCurrentUser, getCurrLeaderGroup, getCurrLeaderTournament, getPendingRequests, loadLeaderboard, loadPlayers, submitScore, getActivePlayersForGroup } from "@tennis-score/redux";
import { connect } from "react-redux";
import EntryForm from "../components/EntryForm";
import ProtectedComponent from "../components/ProtectedComponent";

const mapStateToProps = state => ({
  component: EntryForm,
  players: getActivePlayersForGroup(state),
  user: getCurrentUser(state),
  group: getCurrLeaderGroup(state),
  pendingRequests: getPendingRequests(state),
  appLoaded: getAppLoaded(state),
  tournament: getCurrLeaderTournament(state)
});
const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  submitScore: s => dispatch(submitScore(s)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
