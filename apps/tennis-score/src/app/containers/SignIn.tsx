import { connect } from "react-redux";
import { signIn, resetError } from "@tennis-score/redux";
import SignIn from "../components/SignIn";

const mapStateToProps = ({ app: { lastError, pendingRequests, user } }) => ({
  lastError,
  user,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  signInHandler: data => dispatch(signIn(data)),
  resetError: _ => dispatch(resetError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignIn);
