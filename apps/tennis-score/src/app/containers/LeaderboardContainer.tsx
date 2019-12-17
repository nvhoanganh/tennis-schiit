import { connect } from "react-redux";
import { loadPlayers, loadGroups } from "@tennis-score/redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = ({ app: { appLoaded, user, pendingRequests }, players, groups }) => ({
  players: Object.values(players),
  groups: Object.values(groups),
  user,
  pendingRequests,
  appLoaded
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: groupId => dispatch(loadPlayers(groupId)),
  loadGroups: _ => dispatch(loadGroups()),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
