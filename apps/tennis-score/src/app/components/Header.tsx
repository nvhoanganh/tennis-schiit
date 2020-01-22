import React from "react";
import { Button } from "./Button";
const HeaderCard: React.SFC<{
  right?: any;
  children?: any;
}> = ({ children, right }) => {
  return (
    <div className="d-flex shadow-sm p-2 bg-white border-top border-bottom">
      <div className="flex-grow-1 align-self-center">{children}</div>
      <div className="align-self-center">
        {right ? (
          right
        ) : (
          <Button type="button" className="btn btn-light invisible"></Button>
        )}
      </div>
    </div>
  );
};
export default HeaderCard;
