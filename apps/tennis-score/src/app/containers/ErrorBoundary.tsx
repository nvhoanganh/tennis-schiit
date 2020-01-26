import { useToast } from "@chakra-ui/core";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import "firebase/auth";
import "firebase/firestore";
import React, { useEffect } from "react";
import "../app.scss";
import { AppLoader } from "../components/AppLoader";
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';

export class ErrorBoundary extends React.Component<any, any> {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.log("Error captured by Error Boundary", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      // You can render any custom fallback UI
      return (
        <>
          <ShowError></ShowError>
        </>
      );
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
                <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger h1" />
                <p>Oopps! Something went wrong</p>
                <p className="text-muted x-small">Please reload to try again</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
