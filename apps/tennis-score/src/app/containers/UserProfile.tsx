import { signOut } from "@tennis-score/redux";
import { connect } from "react-redux";
import ProtectedComponent from "../components/ProtectedComponent";
import UserProfile from "../components/UserProfile";

const mapStateToProps = ({ app: { appLoaded, user, pendingRequests } }) => ({
  component: UserProfile,
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
)(ProtectedComponent);
