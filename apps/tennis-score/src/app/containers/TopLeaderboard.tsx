import { connect } from "react-redux";
import { Mocked_Players } from "@tennis-score/api-interfaces";
import { loadPlayers, addScore } from "@tennis-score/redux";
import Leaderboard from '../components/Leaderboard';

const getLeaderboard = (state, ownprops) => {
  console.log("state is", state);
  console.log("ownprops is", ownprops);
  return Mocked_Players;
};

const mapStateToProps = (state, ownprops) => ({
  players: getLeaderboard(state, ownprops)
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  addScore: score => dispatch(addScore(score))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
