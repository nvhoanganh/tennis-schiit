import { connect } from "react-redux";
import { signUp, resetError, signIn } from "@tennis-score/redux";
import SignUp from "../components/SignUp";

const mapStateToProps = ({
  app: { lastError, pendingRequests, user, signUpError }
}) => ({
  lastError,
  signUpError,
  user,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  signInHandler: data => dispatch(signIn(data)),
  resetError: _ => dispatch(resetError()),
  signupHandler: data => dispatch(signUp(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
