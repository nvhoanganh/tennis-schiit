import { getAppIsLoaded, getCurrentUser, getGroupNotMemberOff, getMyGroups, getPendingRequests, getPlayerList, loadGroups } from "@tennis-score/redux";
import { connect } from "react-redux";
import Home from "../components/Home";

const mapStateToProps = state => {
  return {
    players: getPlayerList(state),
    groups: getGroupNotMemberOff(state),
    myGroups: getMyGroups(state),
    user: getCurrentUser(state),
    loading: getPendingRequests(state),
    appLoaded: getAppIsLoaded(state)
  };
};

const mapDispatchToProps = dispatch => ({
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Home);
