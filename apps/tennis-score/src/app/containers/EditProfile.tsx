import { updateProfile } from "@tennis-score/redux";
import { connect } from "react-redux";
import EditProfile from '../components/EditProfile';

const mapStateToProps = ({ app: { lastError, pendingRequests, user } }) => ({
  lastError,
  user,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  updateProfile: data => dispatch(updateProfile(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(EditProfile);
