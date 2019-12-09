import { connect } from "react-redux";
import { loadPlayers, loadGroups } from "@tennis-score/redux";
import Leaderboard from "../components/Leaderboard";

const mapStateToProps = ({ players, groups }) => ({
  players: Object.values(players),
  groups: Object.values(groups)
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadGroups: _ => dispatch(loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
