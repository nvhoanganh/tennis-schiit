import { signOut } from "@tennis-score/redux";
import { connect } from "react-redux";
import UserProfile from '../components/UserProfile';

const mapStateToProps = ({
  app: { lastError, appLoaded, pendingRequests, user }
}) => ({
  lastError,
  user,
  appLoaded,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  signOutHandler: () => dispatch(signOut())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(UserProfile);
