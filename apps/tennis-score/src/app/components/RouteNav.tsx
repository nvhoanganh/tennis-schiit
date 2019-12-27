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
      <div className="p-2 px-3">
        <FontAwesomeIcon
          onClick={() => history.goBack()}
          icon={faLongArrowAltLeft}
        />
      </div>
      <div className="p-2 d-flex">
        <span className="h5 align-self-center">{center}</span>
      </div>
      <div className="p-2">
        {right ? (
          right
        ) : (
          <Button type="button" className="btn btn-light invisible btn-sm"></Button>
        )}
      </div>
    </div>
  );
};

export default RouteNav;
