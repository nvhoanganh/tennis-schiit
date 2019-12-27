import { faChevronLeft, faLongArrowAltLeft } from "@fortawesome/free-solid-svg-icons";
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
          className="btn btn-link btn-sm"
        >
          <FontAwesomeIcon icon={faLongArrowAltLeft} />
        </Button>
      </div>
      <div className="p-2 d-flex">
        <span className="h5 align-self-center">{center}</span>
      </div>
      <div className="p-2">
        {right ? (
          right
        ) : (
          <Button type="button" className="btn btn-light btn-sm invisible"></Button>
        )}
      </div>
    </div>
  );
};

export default RouteNav;
