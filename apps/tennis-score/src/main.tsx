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
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import routes from "./app/routes";
import { FBCONF } from "@tennis-score/api-interfaces";
import chakraTheme from "./theme";
import { ThemeProvider, CSSReset } from "@chakra-ui/core";
// init
console.log("initializing app");
firebase.initializeApp(FBCONF);
toast.configure({
  position: toast.POSITION.BOTTOM_CENTER,
  autoClose: 2500,
  hideProgressBar: true
});
const store = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <ThemeProvider>
      <CSSReset />
      <Router>{renderRoutes(routes)}</Router>
    </ThemeProvider>
  </Provider>,
  document.getElementById("root")
);
