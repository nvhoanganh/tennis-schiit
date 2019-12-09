import { Player, Mocked_Players } from "@tennis-score/api-interfaces";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Table from "react-bootstrap/Table";
import React from "react";
import { LinkContainer } from "react-router-bootstrap";

import {
  faChartLine,
  faUserCircle,
  faSortAmountUp,
  faSortAmountDown,
  faPlus
} from "@fortawesome/free-solid-svg-icons";

const ForgotPassword: React.SFC<{
  onSubmit();
}> = ({ onSubmit }) => {
  return (
    <div className="mt-4 mx-4">
      <LinkContainer to="/signup">
        <a href="" className="float-right btn btn-outline-primary">
          Sign up
        </a>
      </LinkContainer>
      <h4 className="card-title mb-4 mt-1">Sign in</h4>
      <p>
        <a href="" className="btn btn-block btn-outline-info">
          {" "}
          <i className="fab fa-twitter"></i>   Login via Twitter
        </a>
        <a href="" className="btn btn-block btn-outline-primary">
          {" "}
          <i className="fab fa-facebook-f"></i>   Login via facebook
        </a>
      </p>
      <hr />
      <form>
        <div className="form-group">
          <input
            name=""
            className="form-control"
            placeholder="Email or login"
            type="email"
          />
        </div>
        <div className="form-group">
          <input
            className="form-control"
            placeholder="******"
            type="password"
          />
        </div>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                {" "}
                Login{" "}
              </button>
            </div>
          </div>
          <div className="col-md-6 text-right">
            <a className="small" href="#">
              Forgot password?
            </a>
          </div>
        </div>
      </form>
    </div>
  );
};
export default ForgotPassword;
