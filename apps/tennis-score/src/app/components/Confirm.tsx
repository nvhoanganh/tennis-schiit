import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "./Button";

const Confirm = ({
  title,
  message,
  close,
  mainAction,
  mainActionClass,
  onCancelAction,
  onConfirmAction,
  show
}) => {
  return (
    <>
      <Modal show={show} onHide={onCancelAction} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        <Modal.Footer>
          <Button className="btn btn-light" onClick={onCancelAction}>
            {close}
          </Button>
          <Button className={mainActionClass} onClick={onConfirmAction}>
            {mainAction}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default Confirm;
