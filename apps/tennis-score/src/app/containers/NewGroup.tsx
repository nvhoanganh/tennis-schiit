import { addGroup, editGroup } from "@tennis-score/redux";
import { connect } from "react-redux";
import NewGroup from "../components/NewGroup";
import ProtectedComponent from "../components/ProtectedComponent";

const getGroup = (groups, id) =>
  groups && id && groups[id] ? groups[id] : null;
const mapStateToProps = (
  { app: { appLoaded, lastError, pendingRequests, user }, groups },
  ownprops
) => ({
  component: NewGroup,
  user,
  group: getGroup(groups, ownprops.match.params.group),
  appLoaded,
  loading: pendingRequests > 0
});

const mapDispatchToProps = dispatch => ({
  addGroup: data => dispatch(addGroup(data)),
  editGroup: data => dispatch(editGroup(data)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProtectedComponent);
