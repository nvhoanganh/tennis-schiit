import "firebase/auth";
import "firebase/firestore";
import React from "react";
import ReactGA from "react-ga";
import { FaExclamationTriangle } from "react-icons/fa";
import "../app.scss";
export class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    ReactGA.exception({
      description: `${error.toString()} - ${errorInfo.componentStack}`,
      fatal: true
    });
  }

  render() {
    if (this.state.hasError) {
      return <ShowError></ShowError>;
    }
    return this.props.children;
  }
}

function ShowError() {
  return (
    <>
      <div className="container h-100">
        <div className="row align-items-center h-100">
          <div className="mx-auto">
            <div className="text-center">
              <h1 className="display-6">Tennis</h1>
              <p className="lead">
                <em>Score Sheet</em>
              </p>
              <div>
                <FaExclamationTriangle className="text-danger h1" />
                <p>Oops! Something went wrong</p>
                <p
                  className="small btn-link"
                  onClick={() => {
                    window.location.reload();
                  }}
                >
                  Click here to reload
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
