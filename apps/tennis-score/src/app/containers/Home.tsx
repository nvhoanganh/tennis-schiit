import {
  getAppIsLoaded,
  getMyGroups,
  getPlayerList,
  getUser,
  loadGroups,
  getGroupNotMemberOff,
  getLoadingLeaderboard,
  getPendingRequests
} from "@tennis-score/redux";
import { connect } from "react-redux";
import Home from "../components/Home";

const mapStateToProps = state => {
  return {
    players: getPlayerList(state),
    groups: getGroupNotMemberOff(state),
    myGroups: getMyGroups(state),
    user: getUser(state),
    loading: getPendingRequests(state),
    appLoaded: getAppIsLoaded(state)
  };
};

const mapDispatchToProps = dispatch => ({
  loadGroups: _ => dispatch(loadGroups())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);