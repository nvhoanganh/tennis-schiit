import { getCurrLeaderGroup, getCurrLeaderTournament, getHasMore, getLastDoc, getLeaderboardPlayersObj, getLoadingLeaderboard, getScores, loadGroups, loadLeaderboard, loadResults } from "@tennis-score/redux";
import { connect } from "react-redux";
import ViewResults from "../components/ViewResults";

const mapStateToProps = state => ({
  players: getLeaderboardPlayersObj(state),
  group: getCurrLeaderGroup(state),
  tournament: getCurrLeaderTournament(state),
  loading: getLoadingLeaderboard(state),
  
  scores: getScores(state),
  lastDoc: getLastDoc(state),
  hasMore: getHasMore(state),
});

const mapDispatchToProps = dispatch => ({
  loadResult: (groupId, tourid, more) =>
    dispatch(loadResults(groupId, tourid, more)),
  loadGroups: _ => dispatch(loadGroups()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewResults);
