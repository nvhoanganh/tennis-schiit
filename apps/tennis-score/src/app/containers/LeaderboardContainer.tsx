import { connect } from "react-redux";
import {
  loadPlayers,
  loadGroups,
  loadLeaderboard,
  getLeaderboardPlayers
} from "@tennis-score/redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = ({
  app: { appLoaded, user, pendingRequests },
  groups,
  leaderboard: { groupId, tournament, players }
}) => ({
  players: getLeaderboardPlayers({ players }),
  user,
  group: groupId ? groups[groupId] : null,
  pendingRequests,
  appLoaded,
  tournament
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
