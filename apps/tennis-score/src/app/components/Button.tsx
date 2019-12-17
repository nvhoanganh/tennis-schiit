import React from "react";
import Spinner from "react-bootstrap/Spinner";

export const Button = ({ ...props }) => (
  <button {...props}>{props.children}</button>
);
export const UpdateButton = ({ saving, savingText, normalText, ...props }) => (
  <button {...props}>
    {!saving ? (
      normalText
    ) : (
      <>
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        />{" "}
        {savingText}
      </>
    )}
  </button>
);
