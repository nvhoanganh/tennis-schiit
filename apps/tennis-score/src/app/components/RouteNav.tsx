import { faChevronLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React from "react";
import { Button } from "./Button";
const RouteNav: React.SFC<{
  history: any;
  center: any;
  right?: any;
}> = ({ history, center, right }) => {
  return (
    <div className="d-flex justify-content-between pb-1">
      <div className="p-2">
        <Button
          type="button"
          onClick={() => history.goBack()}
          className="btn btn-light"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </Button>
      </div>
      <div className="p-2">{center}</div>
      <div className="p-2">
        {right ? (
          right
        ) : (
          <Button type="button" className="btn btn-light invisible"></Button>
        )}
      </div>
    </div>
  );
};

export default RouteNav;
