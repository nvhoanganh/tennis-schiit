import { faUserCircle } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import React, { useEffect, useState } from "react";
import { LinkContainer } from "react-router-bootstrap";

import { Redirect } from "react-router-dom";
import UpdateButton from "./LoadingButton";
import { Link } from "./Link";
import TextInput from "./TextInput";
import { maxContainer } from "./common";

const SignIn = ({
  resetError,
  signInHandler,
  lastError,
  history,
  loading,
  user
}) => {
  const [state, setState] = useState({
    email: "",
    emailValid: false,
    password: "",
    passwordValid: false,
    formValid: false
  });

  const setValue = (field, value) =>
    setState(curr => ({ ...curr, [field]: value }));

  useEffect(() => {
    setState(current => ({
      ...current,
      passwordValid: !!state.password.trim(),
      emailValid: !!state.email.trim(),
      formValid: !!state.password.trim() && !!state.email.trim()
    }));
  }, [state.email, state.password]);

  useEffect(() => {
    resetError();
  }, []);

  const validateAndSubmit = e => {
    e.preventDefault();
    signInHandler(state);
  };

  return user ? (
    <Redirect to="/home" />
  ) : (
    <div {...maxContainer}>
      <LinkContainer to="/signup">
        <Link
          className="float-right btn btn-outline-primary"
          title="Sign up"
          href=""
        >
          Sign up
        </Link>
      </LinkContainer>
      <h4 className="card-title mb-4 mt-1">Sign in</h4>
      <p>
        <Link
          onClick={() => {
            signInHandler({ isGmail: true });
          }}
          className="btn btn-block btn-outline"
        >
          <FontAwesomeIcon icon={faUserCircle} className="text-danger mr-2" />
          Login via Google
        </Link>
      </p>
      <hr />
      {lastError && <div className="alert alert-danger">Login failed!</div>}
      <form noValidate onSubmit={validateAndSubmit}>
        <TextInput
          type="email"
          name="email"
          label="Email"
          value={state.email}
          placeholder="Email address"
          errorMessage="Valid email is required"
          setValue={setValue}
          isValid={state.emailValid}
        ></TextInput>

        <TextInput
          type="password"
          name="password"
          label="Password"
          value={state.password}
          placeholder="Password"
          errorMessage="Password is required"
          setValue={setValue}
          isValid={state.passwordValid}
        ></TextInput>

        <div className="row">
          <div className="col-md-6">
            <div className="form-group">
              <UpdateButton
                loading={loading}
                value="Sign In"
                type="submit"
                disabled={!state.formValid || loading}
                className="btn btn-primary btn-sm btn-block"
              ></UpdateButton>
            </div>
          </div>
          <div className="col-md-6 text-right">
            <LinkContainer to={`/forgot-password`}>
              <Link title="Forgot Password?" href="" className="small">
                Forgot Password?
              </Link>
            </LinkContainer>
          </div>
        </div>
      </form>
    </div>
  );
};
export default SignIn;
