import { addPlayer, getCurrentUser, getLeaderboardPlayers, loadLeaderboard, loadPlayers } from "@tennis-score/redux";
import { connect } from "react-redux";
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
