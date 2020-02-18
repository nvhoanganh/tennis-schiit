import { connect } from "react-redux";
import {
  loadPlayers,
  loadGroups,
  loadLeaderboard,
  getLeaderboardPlayers,
  addPlayer,
  getCurrentUser
} from "@tennis-score/redux";
import Leaderboard from "../components/Leaderboard";
import AddPlayer from "../components/AddPlayer";

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
  addPlayer: d => dispatch(addPlayer(d)),
  getUser: u => dispatch(getCurrentUser(u)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddPlayer);
