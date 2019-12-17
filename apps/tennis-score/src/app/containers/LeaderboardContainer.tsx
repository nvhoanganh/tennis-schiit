import { connect } from "react-redux";
import { loadPlayers, loadGroups, loadLeaderboard } from "@tennis-score/redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = ({
  app: { appLoaded, user, pendingRequests },
  players,
  groups,
  leaderboard
}) => ({
  players: Object.values(players),
  user,
  group: leaderboard.groupId ? groups[leaderboard.groupId] : null,
  pendingRequests,
  appLoaded,
  Leaderboard
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadGroups: _ => dispatch(loadGroups()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
