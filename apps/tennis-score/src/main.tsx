import React from "react";
import ReactDOM from "react-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import { renderRoutes } from "react-router-config";
import routes from "./app/routes";
import { BrowserRouter as Router } from "react-router-dom";

ReactDOM.render(
  <Router>{renderRoutes(routes)}</Router>,
  document.getElementById("root")
);
