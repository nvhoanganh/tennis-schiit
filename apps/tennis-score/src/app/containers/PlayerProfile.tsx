import { signOut } from "@tennis-score/redux";
import { connect } from "react-redux";
import ProtectedComponent from "../components/ProtectedComponent";
import UserProfile from "../components/UserProfile";
import PlayerProfile from "../components/PlayerProfile";

const mapStateToProps = ({ app: { appLoaded, user, pendingRequests } }) => ({
  user,
  loading: pendingRequests > 0,
  appLoaded
});

const mapDispatchToProps = dispatch => ({
  signOutHandler: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlayerProfile);
