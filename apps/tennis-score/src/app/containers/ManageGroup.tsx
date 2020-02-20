import { deleteGroup, loadLeaderboard, loadPlayers } from "@tennis-score/redux";
import { connect } from "react-redux";
import ManageGroup from "../components/ManageGroup";

const mapStateToProps = ({
  app: { appLoaded, user, pendingRequests },
  groups,
  leaderboard: { groupId, tournament, players }
}) => ({
  user,
  group: groupId ? groups[groupId] : null,
  pendingRequests,
  tournament
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId)),
  deleteGroup: groupId => dispatch(deleteGroup(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageGroup);
