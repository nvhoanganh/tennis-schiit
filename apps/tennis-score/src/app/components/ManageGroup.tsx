import React, { useState, useEffect } from "react";
import UpdateButton from "./LoadingButton";
import RouteNav from "./RouteNav";
import Modal from "react-bootstrap/Modal";
import { Button } from "./Button";

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
      history.push('/home');
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
        <pre>{JSON.stringify(group, null, 2)}</pre>

        <div className="row">
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
      </div>

      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete?</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-light" onClick={handleClose}>
            Close
          </Button>
          <Button className="btn btn-danger" onClick={deleteGroupHandler}>
            Delete
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default ManageGroup;
