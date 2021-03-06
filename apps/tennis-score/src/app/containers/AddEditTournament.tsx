import { addTournament, getLeaderboardPlayers, loadLeaderboard } from "@tennis-score/redux";
import { connect } from "react-redux";
import AddEditTournament from "../components/AddEditTournament";

const mapStateToProps = ({
  app: { appLoaded, user, pendingRequests },
  groups,
  leaderboard: { groupId, tournament, players }
}) => ({
  players: getLeaderboardPlayers({ players }),
  user,
  group: groupId ? groups[groupId] : null,
  loading: pendingRequests > 0,
  appLoaded,
  tournament
});

const mapDispatchToProps = dispatch => ({
  addTournament: d => dispatch(addTournament(d)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditTournament);
