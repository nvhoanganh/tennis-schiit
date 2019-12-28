import { connect } from "react-redux";
import { signUp, resetError } from "@tennis-score/redux";
import SignUp from "../components/SignUp";

const mapStateToProps = ({ app: { lastError, pendingRequests } }) => ({
  lastError,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  resetError: _ => dispatch(resetError()),
  signupHandler: data => dispatch(signUp(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
