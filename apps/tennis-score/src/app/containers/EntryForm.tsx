import {
  getLeaderboardPlayers,
  loadGroups,
  loadLeaderboard,
  loadPlayers,
  submitScore
} from "@tennis-score/redux";
import { connect } from "react-redux";
import EntryForm from "../components/EntryForm";
import ProtectedComponent from "../components/ProtectedComponent";

const mapStateToProps = ({
  app: { appLoaded, user, pendingRequests },
  groups,
  leaderboard: { groupId, players }
}) => ({
  component: EntryForm,
  players: getLeaderboardPlayers({ players }),
  user,
  group: groupId ? groups[groupId] : null,
  pendingRequests,
  appLoaded
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadGroups: _ => dispatch(loadGroups()),
  submitScore: s => dispatch(submitScore(s)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
