import React from "react";
import { FaArrowLeft } from "react-icons/fa";
import { Button } from "./Button";
const RouteNav: React.SFC<{
  history: any;
  center: any;
  right?: any;
  hideBack?: boolean;
}> = ({ history, center, right, hideBack }) => {
  return (
    <div className="d-flex justify-content-between sticky first bg-white border-bottom mb-2">
      <div className="p-2 align-self-center">
        {!hideBack && (
          <Button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-link btn-sm text-dark"
          >
            <FaArrowLeft style={{ fontSize: "1.2rem" }} />
          </Button>
        )}
      </div>
      <div className="p-2 d-flex align-self-center h5 mb-0">{center}</div>
      <div className="p-2 align-self-center">
        {right ? (
          right
        ) : (
          <Button
            type="button"
            className="btn btn-light btn-sm invisible"
          ></Button>
        )}
      </div>
    </div>
  );
};

export default RouteNav;
