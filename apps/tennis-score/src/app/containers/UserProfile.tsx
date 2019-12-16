import { signOut } from "@tennis-score/redux";
import { connect } from "react-redux";
import ProtectedComponent from "../components/ProtectedComponent";
import UserProfile from "../components/UserProfile";

const mapStateToProps = ({ app: { appLoaded, user } }) => ({
  component: UserProfile,
  user,
  appLoaded
});

const mapDispatchToProps = dispatch => ({
  signOutHandler: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
