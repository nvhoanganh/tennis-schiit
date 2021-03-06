import React from "react";
import { Button } from "./Button";
const HeaderCard: React.SFC<{
  right?: any;
  children?: any;
  style?: any;
  className?: any;
}> = ({ children, right, style, className }) => {
  return (
    <div
      className={
        "d-flex p-2 bg-white border-top border-bottom " + className
      }
      style={style}
    >
      <div className="flex-grow-1 align-self-center header__content">{children}</div>
      <div className="align-self-center header__rightmore">
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
