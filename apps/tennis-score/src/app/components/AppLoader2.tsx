import React, { useEffect } from "react";
import "./AppLoader.scss";
export function AppLoader(props) {
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
              <div className="lead m-auto text-center apploader pt-2">
                <div className="loader">
                  <svg viewBox="0 0 80 80">
                    <circle id="test" cx="40" cy="40" r="32"></circle>
                  </svg>
                </div>

                <div className="loader triangle">
                  <svg viewBox="0 0 86 80">
                    <polygon points="43 8 79 72 7 72"></polygon>
                  </svg>
                </div>

                <div className="loader">
                  <svg viewBox="0 0 80 80">
                    <rect x="8" y="8" width="64" height="64"></rect>
                  </svg>
                </div>

                <a
                  className="dribbble"
                  href="https://dribbble.com/shots/5878367-Loaders"
                  target="_blank"
                ></a>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}
