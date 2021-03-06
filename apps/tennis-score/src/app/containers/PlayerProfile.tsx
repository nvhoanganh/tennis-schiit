import { getAllGroups, getAppLoaded, getCurrentUser, getCurrLeaderGroup, getCurrLeaderTournament, getLeaderBoardGroupUser, getLeaderboardPlayersObj, getPendingRequests, getPlayer, loadLeaderboard, playerOtherGroups } from "@tennis-score/redux";
import { connect } from "react-redux";
import PlayerProfile from "../components/PlayerProfile";

const mapStateToProps = state => {
  return {
    user: getCurrentUser(state),
    players: getLeaderboardPlayersObj(state),
    player: getLeaderBoardGroupUser(state),
    group: getCurrLeaderGroup(state),
    groups: getAllGroups(state),
    playerGroups: playerOtherGroups(state),
    tournament: getCurrLeaderTournament(state),
    pendingRequests: getPendingRequests(state),
    appLoaded: getAppLoaded(state)
  };
};

const mapDispatchToProps = dispatch => ({
  getPlayer: (playerId, userId) => dispatch(getPlayer(playerId, userId)),
  loadLeaderboard: groupId => dispatch(loadLeaderboard(groupId))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerProfile);
