import React from "react";
import MySpinner from "./MySpinner";
export function AppLoader({}) {
  return (
    <div className="container h-100">
      <div className="row align-items-center h-100">
        <div className="mx-auto">
          <div className="text-center">
            <h1 className="display-4">Tennis</h1>
            <p className="lead">
              <em>Score Sheet</em>
            </p>
            <div className="lead">
              <MySpinner fontSize="0.7rem" width={25} height={25} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
