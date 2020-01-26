import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "./Button";
const RouteNav: React.SFC<{
  history: any;
  center: any;
  right?: any;
  hideBack?: boolean;
}> = ({ history, center, right, hideBack }) => {
  return (
    <div className="d-flex justify-content-between pb-1">
      <div className="p-2 align-self-center">
        {!hideBack && (
          <Button
            type="button"
            onClick={() => history.goBack()}
            className="btn btn-link btn-sm text-dark"
          >
            <FontAwesomeIcon icon={faAngleLeft} style={{ fontSize: "1.3rem"}} />
          </Button>
        )}
      </div>
      <div className="p-2 d-flex align-self-center h5">{center}</div>
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
