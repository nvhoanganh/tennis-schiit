import {
  getLeaderboardPlayers,
  loadGroups,
  loadLeaderboard,
  loadPlayers,
  addTournament
} from "@tennis-score/redux";
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
  pendingRequests,
  appLoaded,
  tournament
});

const mapDispatchToProps = dispatch => ({
  addTournament: d => dispatch(addTournament(d)),
  loadGroups: _ => dispatch(loadGroups()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AddEditTournament);
