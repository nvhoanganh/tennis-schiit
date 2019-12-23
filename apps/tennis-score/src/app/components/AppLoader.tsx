import React from "react";
import MySpinner from "./MySpinner";
export function AppLoader({}) {
  return (
    <div className="container h-100">
      <div className="row align-items-center h-100">
        <div className="mx-auto">
          <div className="text-center">
            <h1 className="display-4">Tennis Sheet</h1>
            <p className="lead">
              <em>Loading...</em>
            </p>
            <div className="lead">
              <MySpinner />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
