import Spinner from "react-bootstrap/Spinner";
import React from "react";
export interface Props {
  loading: boolean;
  value: string;
  loadingText?: string;
  [k: string]: any;
}

const UpdateButton: React.SFC<Props> = ({
  loading,
  value,
  loadingText,
  ...props
}) => {
  return (
    <button {...props}>
      {!loading ? (
        value
      ) : (
        <>
          <Spinner
            as="span"
            animation="border"
            size="sm"
            role="status"
            aria-hidden="true"
          />{" "}
          {loadingText || value}
        </>
      )}
    </button>
  );
};
export default UpdateButton;
