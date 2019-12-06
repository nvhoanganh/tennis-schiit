import { connect } from "react-redux";
import { Mocked_Players } from "@tennis-score/api-interfaces";
import { loadPlayers, addScore } from "@tennis-score/redux";
import Leaderboard from '../components/Leaderboard';

const getLeaderboard = state => {
  console.log("state is", state);
  return Mocked_Players;
};

const mapStateToProps = state => ({
  players: getLeaderboard(state)
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  addScore: score => dispatch(addScore(score))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Leaderboard);
