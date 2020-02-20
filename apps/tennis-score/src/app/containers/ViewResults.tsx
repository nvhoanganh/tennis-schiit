import { getCurrentUser, getCurrLeaderGroup, getCurrLeaderTournament, getHasMore, getLastDoc, getLeaderboardPlayersObj, getLoadingLeaderboard, getScores, getScoresSortedByDate, loadLeaderboard, loadResults } from "@tennis-score/redux";
import { connect } from "react-redux";
import ViewResults from "../components/ViewResults";

const mapStateToProps = state => ({
  players: getLeaderboardPlayersObj(state),
  group: getCurrLeaderGroup(state),
  tournament: getCurrLeaderTournament(state),
  loading: getLoadingLeaderboard(state),
  user: getCurrentUser(state),
  scores: getScores(state),
  scoresSorted: getScoresSortedByDate(state),
  lastDoc: getLastDoc(state),
  hasMore: getHasMore(state)
});

const mapDispatchToProps = dispatch => ({
  loadResult: (groupId, tourid, more) =>
    dispatch(loadResults(groupId, tourid, more)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewResults);
