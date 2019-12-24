import { connect } from "react-redux";
import {
  loadPlayers,
  loadGroups,
  loadLeaderboard,
  getLeaderboardPlayers,
  deleteGroup
} from "@tennis-score/redux";
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
  loadGroups: _ => dispatch(loadGroups()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId)),
  deleteGroup: groupId => dispatch(deleteGroup(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ManageGroup);
