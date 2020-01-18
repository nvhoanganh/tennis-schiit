import { getGroupImageUrl } from '@tennis-score/redux';
import { formatDistanceToNow } from "date-fns";
import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { maxContainer } from "./common";
import Confirm from "./Confirm";
import { Link } from "./Link";
import UpdateButton from "./LoadingButton";
import { ReadOnlyForm } from "./ReadOnlyForm";
import RouteNav from "./RouteNav";

const ManageGroup = ({
  loading,
  history,
  match,
  group,
  deleteGroup,
  ...props
}) => {
  useEffect(() => {
    props.loadLeaderboard(match.params.group);
  }, []);

  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const deleteGroupHandler = () => {
    deleteGroup(match.params.group).then(_ => {
      setShow(false);
      history.push("/home");
    });
  };

  if (!group) return null;
  return (
    <>
      <RouteNav history={history} center={group.name.toUpperCase()}></RouteNav>
      <div {...maxContainer}>
        {group && (
          <div className="pb-2">
            <img
              src={getGroupImageUrl(group.groupImage)}
              style={{
                height: 140,
                objectFit: "cover"
              }}
              className="card-img-top border"
            ></img>
          </div>
        )}
        <ReadOnlyForm label="Owner" value={group.onwerName} />
        <ReadOnlyForm
          label="Created"
          value={formatDistanceToNow(group.createdOn.toDate(), {
            addSuffix: true
          })}
        />
        <ReadOnlyForm label="Description" value={group.description} />
        <ReadOnlyForm
          label="Players"
          value={Object.keys(group.players).length}
        />
        <div className="row pt-3">
          <div className="col-12">
            <div className="form-group">
              <UpdateButton
                loading={loading}
                value="Delete Group"
                type="button"
                onClick={handleShow}
                className="btn btn-danger btn-block btn-sm"
              ></UpdateButton>
            </div>
          </div>
        </div>
        <div className="row pb-5">
          <div className="col-12 text-center">
            <LinkContainer to={`/editgroup/${group.groupId}`}>
              <Link title="Update Details" href="">
                Update Details
              </Link>
            </LinkContainer>
          </div>
        </div>
      </div>

      <Confirm
        title="Permanent Delete?"
        message="Are you sure you want to permanently delete this group? All data will be lost"
        close="Cancel"
        mainAction="Delete"
        mainActionClass="red"
        onCancelAction={handleClose}
        onConfirmAction={deleteGroupHandler}
        show={show}
      ></Confirm>
    </>
  );
};

export default ManageGroup;
