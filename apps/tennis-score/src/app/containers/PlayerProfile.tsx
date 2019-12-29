import {
  getAppLoaded,
  getCurrLeaderGroup,
  getLeaderboardPlayers,
  getLoadingLeaderboard,
  getPendingRequests,
  getUser,
  signOut,
  loadGroups,
  loadLeaderboard,
  getCurrLeaderTournament
} from "@tennis-score/redux";
import { connect } from "react-redux";
import PlayerProfile from "../components/PlayerProfile";

const mapStateToProps = (state, ownProps) => {
  const g = getCurrLeaderGroup(state);
  const tour = getCurrLeaderTournament(state);
  const getPlayer = () => {
    if (g && tour && ownProps.match.params.group && ownProps.match.params.id) {
      return {
        ...g.players[ownProps.match.params.id],
        ...tour.players[ownProps.match.params.id]
      };
    }
    return null;
  };
  return {
    user: getUser(state),
    player: getPlayer(),
    group: getCurrLeaderGroup(state),
    tournament: getCurrLeaderTournament(state),
    pendingRequests: getPendingRequests(state),
    appLoaded: getAppLoaded(state),
    loading: getLoadingLeaderboard(state)
  };
};

const mapDispatchToProps = dispatch => ({
  loadGroups: _ => dispatch(loadGroups()),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerProfile);
