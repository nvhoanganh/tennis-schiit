import { loadGroups, loadPlayers } from "@tennis-score/redux";
import { connect } from "react-redux";
import Home from '../components/Home';

const mapStateToProps = ({ app: { appLoaded, user }, players, groups }) => ({
  players: Object.values(players),
  groups: Object.values(groups),
  user,
  appLoaded
});

const mapDispatchToProps = dispatch => ({
  loadPlayers: _ => dispatch(loadPlayers()),
  loadGroups: _ => dispatch(loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);

