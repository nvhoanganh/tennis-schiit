import { CSSReset, ThemeProvider } from "@chakra-ui/core";
import { FBCONF } from "@tennis-score/api-interfaces";
import { configureStore } from "@tennis-score/redux";
import "bootstrap/dist/css/bootstrap.min.css";
import * as firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import React from "react";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import { renderRoutes } from "react-router-config";
import { BrowserRouter as Router } from "react-router-dom";
import { ErrorBoundary } from "./app/containers/ErrorBoundary";
import routes from "./app/routes";
import chakraTheme from "./theme";
import ReactGA from "react-ga";
import { createBrowserHistory } from "history";
import { version } from "./assets/version";

const trackingId = "UA-153446671-1";
const store = configureStore({});
const history = createBrowserHistory();

// init
firebase.initializeApp(FBCONF);
firebase
  .firestore()
  .enablePersistence()
  .catch(err => console.log("failed to enable offline support", err));

ReactGA.initialize(trackingId);

// Initialize google analytics page view tracking
history.listen(location => {
  ReactGA.set({ page: location.pathname }); // Update the user's current page
  ReactGA.set({ dimension1: version });
  ReactGA.pageview(location.pathname); // Record a pageview for the given page
});

// unhandled error from promise
window.addEventListener("unhandledrejection", function(event) {
  ReactGA.exception({
    description: `Unhandled rejection - reason: ${event.reason})`,
    fatal: true
  });
});

// timing
if (window.performance) {
  ReactGA.timing({
    category: "AppLoad",
    variable: "init",
    value: Math.round(performance.now())
  });
}

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={chakraTheme}>
        <CSSReset />
        <Router history={history}>{renderRoutes(routes)}</Router>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);
