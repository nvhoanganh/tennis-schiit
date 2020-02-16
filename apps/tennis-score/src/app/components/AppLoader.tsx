import bodymovin from "lottie-web";
import React, { useEffect } from "react";
export function AppLoader(props) {
  useEffect(() => {
    bodymovin.loadAnimation({
      container: document.getElementById("spinner"),
      autoplay: true,
      loop: true,
      path:
        "/assets/fidget-spinner.json"
    });
  }, []);

  return (
    <div className="container h-100">
      <div className="row align-items-center h-100">
        <div className="mx-auto">
          <div className="text-center">
            <h1 className="display-6">Tennis</h1>
            <p className="lead">
              <em>Score Sheet</em>
            </p>
            {!props.hideSpinner ? (
              <div
                className="lead m-auto text-center"
                id="spinner"
                style={{ height: 60, width: 60 }}
              ></div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
