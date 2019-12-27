import React from "react";
import Spinner from "react-bootstrap/Spinner";
function MySpinner({ fontSize, height, width }) {
  return (
    <div className="px-1 pb-5 text-center">
      <Spinner
        style={{
          fontSize,
          height,
          width,
          padding: 10,
          marginTop: 26
        }}
        variant="primary"
        className="text-center"
        animation="border"
      />
    </div>
  );
}

MySpinner.defaultProps = {
  fontSize: "1rem",
  height: 40,
  width: 40,
};
export default MySpinner;
