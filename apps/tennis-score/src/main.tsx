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
import routes from "./app/routes";
import { FBCONF } from "@tennis-score/api-interfaces";
import chakraTheme from "./theme";
import { ThemeProvider, theme, CSSReset } from "@chakra-ui/core";
import { ErrorBoundary } from "./app/containers/ErrorBoundary";
// init
firebase.initializeApp(FBCONF);
const store = configureStore({});

ReactDOM.render(
  <ErrorBoundary>
    <Provider store={store}>
      <ThemeProvider theme={chakraTheme}>
        <CSSReset />
        <Router>{renderRoutes(routes)}</Router>
      </ThemeProvider>
    </Provider>
  </ErrorBoundary>,
  document.getElementById("root")
);
