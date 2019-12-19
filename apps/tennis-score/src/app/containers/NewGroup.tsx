import { connect } from "react-redux";
import { signUp, addGroup } from "@tennis-score/redux";
import NewGroup from "../components/NewGroup";

const mapStateToProps = ({ app: { lastError, pendingRequests } }) => ({
  lastError,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  addGroup: data => dispatch(addGroup(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(NewGroup);
