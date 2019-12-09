import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";

import {
  faUserCircle} from "@fortawesome/free-solid-svg-icons";
import TextInput from "./TextInput";
import { isValidEmail } from "@tennis-score/core";

const SignIn: React.SFC<{
  loginHandler();
  loginGoogle();
}> = ({ loginHandler }) => {
  const [email, setEmail] = useState("");
  const [emailValid, setEmailValid] = useState(true);

  const [password, setPassword] = useState("");
  const [passwordValid, setPasswordValid] = useState(true);

  const [validated, setValidated] = useState(false);

  useEffect(() => {
    setPasswordValid(!!password || !validated);
  }, [password, validated]);

  useEffect(() => {
    setEmailValid(isValidEmail(email) || !validated);
  }, [email, validated]);

  const validateAndSubmit = e => {
    setValidated(true);
    e.preventDefault();
    e.stopPropagation();
    if (loginHandler && emailValid && passwordValid) {
      loginHandler();
    }
  };

  return (
    <div className="mt-4 mx-4">
      <LinkContainer to="/signup">
        <a href="" className="float-right btn btn-outline-primary">
          Sign up
        </a>
      </LinkContainer>
      <h4 className="card-title mb-4 mt-1">Sign in</h4>
      <p>
        <a
          onClick={() => {
            console.log("login via google");
          }}
          className="btn btn-block btn-outline-danger"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-danger mr-2" />
          Login via Google
        </a>
      </p>
      <hr />
      <form noValidate onSubmit={validateAndSubmit}>
        <TextInput
          type="email"
          name="username"
          label="Username"
          value={email}
          placeholder="Email address"
          errorMessage="Valid email is required"
          setValue={setEmail}
          isValid={emailValid}
        ></TextInput>

        <TextInput
          type="password"
          name="password"
          label="Password"
          value={password}
          placeholder="Password"
          errorMessage="Password is required"
          setValue={setPassword}
          isValid={passwordValid}
        ></TextInput>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <button type="submit" className="btn btn-primary btn-block">
                Login
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
export default SignIn;
