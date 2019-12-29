import { connect } from "react-redux";
import { signUp, addGroup } from "@tennis-score/redux";
import NewGroup from "../components/NewGroup";
import ProtectedComponent from "../components/ProtectedComponent";

const mapStateToProps = ({
  app: { appLoaded, lastError, pendingRequests, user }
}) => ({
  component: NewGroup,
  user,
  lastError,
  appLoaded,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  addGroup: data => dispatch(addGroup(data))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
