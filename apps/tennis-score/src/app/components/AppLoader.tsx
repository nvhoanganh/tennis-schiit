import React, { useEffect } from "react";
import MySpinner from "./MySpinner";
import bodymovin from "lottie-web";
export function AppLoader({}) {
  useEffect(() => {
    bodymovin.loadAnimation({
      container: document.getElementById("spinner"), // Required
      autoplay: true,
      loop: true,
      path:
        "https://maxst.icons8.com/vue-static/landings/animated-icons/icons/fidget-spinner/fidget-spinner.json" // Required
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
            <div
              className="lead m-auto text-center"
              id="spinner"
              style={{ height: 60, width: 60 }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
}
