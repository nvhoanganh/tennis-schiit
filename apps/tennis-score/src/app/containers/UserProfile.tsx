import { connect } from "react-redux";
import { signOut } from "@tennis-score/redux";
import UserProfile from '../components/UserProfile';

const mapStateToProps = ({ app: { lastError, pendingRequests, user } }) => ({
  lastError,
  user,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  signOutHandler: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
