import { updateProfile } from "@tennis-score/redux";
import { connect } from "react-redux";
import EditProfile from "../components/EditProfile";
import ProtectedComponent from "../components/ProtectedComponent";

const mapStateToProps = ({ app: { appLoaded, user, pendingRequests } }) => ({
  component: EditProfile,
  pendingRequests,
  user,
  appLoaded
});

const mapDispatchToProps = dispatch => ({
  updateProfile: data => dispatch(updateProfile(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
