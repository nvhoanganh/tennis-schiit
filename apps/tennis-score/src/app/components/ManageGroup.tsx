import { ReadOnlyForm } from "./ReadOnlyForm";
import { LinkContainer } from "react-router-bootstrap";
import React, { useState, useEffect } from "react";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import Modal from "react-bootstrap/Modal";
import { Button } from "./Button";
import Confirm from "./Confirm";
import { formatDistanceToNow } from "date-fns";
import { Link } from './Link';

const ManageGroup = ({
  loading,
  history,
  match,
  group,
  deleteGroup,
  ...props
}) => {
  useEffect(() => {
    props.loadGroups();
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
      <RouteNav
        history={history}
        center={<span className="h3">{group.name.toUpperCase()}</span>}
      ></RouteNav>
      <div className="mt-4 mx-4">
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
                className="btn btn-danger btn-block"
              ></UpdateButton>
            </div>
          </div>
        </div>
        <div className="row pb-5">
          <div className="col-md-6 text-center">
            <LinkContainer to={`/editgroup/${group.groupId}`} >
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
        close="Close"
        mainAction="Delete"
        mainActionClass="btn btn-danger"
        onCancelAction={handleClose}
        onConfirmAction={deleteGroupHandler}
        show={show}
      ></Confirm>
    </>
  );
};

export default ManageGroup;
