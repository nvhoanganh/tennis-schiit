import { resetPassword, resetError } from "@tennis-score/redux";
import { connect } from "react-redux";
import ResetPassword from "../components/ResetPassword";

const mapStateToProps = ({ app: { lastError, pendingRequests } }) => ({
  lastError,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  resetPassword: email => dispatch(resetPassword(email)),
  resetError: _ => dispatch(resetError())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ResetPassword);
