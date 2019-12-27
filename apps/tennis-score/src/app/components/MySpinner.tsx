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
  fontSize: "2rem",
  height: 80,
  width: 80,
};
export default MySpinner;
