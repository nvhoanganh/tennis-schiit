import React, { useEffect } from "react";

const ProtectedComponent = ({ component: Component, ...rest }) => {
  const { user, appLoaded, history } = rest;
  useEffect(() => {
    if (appLoaded && !user) {
      history.push(
        "/signin?ReturnUrl=" + encodeURIComponent(window.location.pathname)
      );
    }
  }, [appLoaded]);
  return <Component {...rest}></Component>;
};

export default ProtectedComponent;
