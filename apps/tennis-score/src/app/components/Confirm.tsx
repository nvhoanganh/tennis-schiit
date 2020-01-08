import React, { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { Button } from "./Button";

const Confirm = ({ title, message, show, ...props }) => {
  return (
    <>
      <Modal show={show} onHide={props.onCancelAction} centered>
        <Modal.Header closeButton>
          <Modal.Title>{title}</Modal.Title>
        </Modal.Header>
        <Modal.Body>{message}</Modal.Body>
        {!props.hideFooter ? (
          <Modal.Footer>
            <Button className="btn btn-link" onClick={props.onCancelAction}>
              {props.close}
            </Button>
            {props.mainAction ? (
              <Button
                className={props.mainActionClass}
                onClick={props.onConfirmAction}
              >
                {props.mainAction}
              </Button>
            ) : null}
          </Modal.Footer>
        ) : null}
      </Modal>
    </>
  );
};

export default Confirm;
