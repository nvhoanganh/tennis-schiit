import {
  signOut,
  getCurrentUser,
  getLeaderBoardGroupUser,
  getCurrLeaderGroup,
  getCurrLeaderTournament,
  getPendingRequests,
  getAppLoaded,
  getLoadingLeaderboard,
  getAllGroups
} from "@tennis-score/redux";
import { connect } from "react-redux";
import ProtectedComponent from "../components/ProtectedComponent";
import UserProfile from "../components/UserProfile";

const mapStateToProps = state => {
  return {
    component: UserProfile,
    user: getCurrentUser(state),
    player: getLeaderBoardGroupUser(state),
    groups: getAllGroups(state),
    tournament: getCurrLeaderTournament(state),
    pendingRequests: getPendingRequests(state),
    appLoaded: getAppLoaded(state),
    loading: getLoadingLeaderboard(state)
  };
};

const mapDispatchToProps = dispatch => ({
  signOutHandler: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
