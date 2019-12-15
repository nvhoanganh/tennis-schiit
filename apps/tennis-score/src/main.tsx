import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { renderRoutes } from "react-router-config";
import routes from "./app/routes";
import { BrowserRouter as Router } from "react-router-dom";
import { Provider } from "react-redux";
import { configureStore } from "@tennis-score/redux";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

toast.configure({
  position: toast.POSITION.BOTTOM_CENTER,
  autoClose: 1000,
  hideProgressBar: true
});
const store = configureStore({});

ReactDOM.render(
  <Provider store={store}>
    <Router>{renderRoutes(routes)}</Router>
  </Provider>,
  document.getElementById("root")
);
